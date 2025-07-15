import { register_settings_storage } from "./register_settings_storage"
import { load_settings_storage } from "./load_settings_storage"
import { load_provider_option } from "./load_provider_option"
export async function load_settings(provider_options) {
    await register_settings_storage();
    await load_settings_storage();

    Object.entries(provider_options).forEach(
        ([provider_name, option]) => load_provider_option(option.querySelector("input"), provider_name)
    );
}