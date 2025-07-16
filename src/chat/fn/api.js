// @ts-nocheck
import framework from "./framework";
import { get_api_key_by_provider } from "./get_api_key_by_provider"
import { settings } from "../constant"
import { read_response } from "./read_response"
// import { finish_message } from "./finish_message"
export async function api(ressource, args = null, files = null, message_id = null, finish_message = null) {
    // const controller_storage = window.controller_storage | {}
    // @ts-ignore
    if (window?.pywebview) {
        if (args !== null) {
            if (ressource == "conversation") {
                // @ts-ignore
                return pywebview.api[`get_${ressource}`](args, message_id);
            }
            if (ressource == "models") {
                ressource = "provider_models";
            }
            // @ts-ignore
            return pywebview.api[`get_${ressource}`](args);
        }
        // @ts-ignore
        return pywebview.api[`get_${ressource}`]();
    }
    let headers = {};
    let url = `${framework.backendUrl}/backend-api/v2/${ressource}`;
    let response;
    let api_base, api_key
    if (ressource == "models" && args) {
        if (providerModelSignal) {
            providerModelSignal.abort();
        }
        providerModelSignal = new AbortController();
        api_key = get_api_key_by_provider(args);
        if (api_key) {
            headers.x_api_key = api_key;
        }
        // @ts-ignore
        api_base = args == "Custom" ? document.getElementById(`${args}-api_base`).value : null;
        if (api_base) {
            headers.x_api_base = api_base;
        }
        const ignored = Array.from(settings.querySelectorAll("input.provider:not(:checked)")).map((el) => el.value);
        if (ignored) {
            headers.x_ignored = ignored.join(" ");
        }
        url = `${framework.backendUrl}/backend-api/v2/${ressource}/${args}`;
        headers['content-type'] = 'application/json';
        response = await fetch(url, {
            method: 'GET',
            // @ts-ignore
            headers: headers,
            signal: providerModelSignal.signal,
        });
    } else if (ressource == "conversation") {
        let body = JSON.stringify(args);
        // @ts-ignore
        headers = {
            accept: 'text/event-stream',
            ...await framework.getHeaders()
        };
        if (files.length > 0) {
            const formData = new FormData();
            for (const file of files) {
                if (file instanceof File) {
                    formData.append('files', file)
                } else {
                    formData.append('media_url', file.url ? file.url : file)
                }
            }
            formData.append('json', body);
            // @ts-ignore
            body = formData;
        } else {
            headers['content-type'] = 'application/json';
        }
        response = await fetch(url, {
            method: 'POST',
            signal: window.controller_storage[message_id].signal,
            // @ts-ignore
            headers: headers,
            body: body,
        });
        // On Ratelimit
        if (response.status == 429) {
            const body = await response.text();
            const title = body.match(/<title>([^<]+?)<\/title>/)[1];
            const message = body.match(/<p>([^<]+?)<\/p>/)[1];
            window.error_storage[message_id] = `**${title}**\n${message}`;
            await finish_message();
            return;
        } else {
            try {
                await read_response(response, message_id, args.provider || null, finish_message);
            } catch (e) {
                console.error(e);
                if (continue_storage[message_id]) {
                    delete continue_storage[message_id];
                    await api("conversation", args, files, message_id, finish_message)
                    await read_response(response, message_id, args.provider || null, finish_message);
                }
            }
            if (response.status == 524) {
                await api("conversation", args, files, message_id, finish_message)
                await read_response(response, message_id, args.provider || null, finish_message);
            }
            await finish_message();
            return;
        }
    } else if (args) {
        if (ressource == "log" || ressource == "usage") {
            if (ressource == "log" && !document.getElementById("report_error").checked) {
                return;
            }
        }
        headers['content-type'] = 'application/json';
        response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(args),
        });
    }
    if (!response) {
        response = await fetch(url, { headers: headers });
    }
    if (response.status != 200) {
        console.error(response);
    }
    return await response.json();
}
