import framework from "./framework";
export const say_hello = async () => {
  let tokens = framework.translate(`Hello! How can I assist you today?`).split(" ").map((token) => token + " ");

  chatBody.innerHTML += `
<ul class="">
        <li class="message max-w-6xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 text-gray-800 dark:text-white">
          <svg class="shrink-0 size-9.5 rounded-full" width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="38" rx="6" fill="#2563EB" />
            <path d="M10 28V18.64C10 13.8683 14.0294 10 19 10C23.9706 10 28 13.8683 28 18.64C28 23.4117 23.9706 27.28 19 27.28H18.25" stroke="white" stroke-width="1.5" />
            <path d="M13 28V18.7552C13 15.5104 15.6863 12.88 19 12.88C22.3137 12.88 25 15.5104 25 18.7552C25 22 22.3137 24.6304 19 24.6304H18.25" stroke="white" stroke-width="1.5" />
            <ellipse cx="19" cy="18.6554" rx="3.75" ry="3.6" fill="white" />
          </svg>
 
          <div class="space-y-3">
            <div class="content"><p class=" welcome-message"></p></div>
            <div class="provider" data-provider="${provider}"></div>
            <div class="content_inner"></div>
            <div class="count"></div>
          </div>
        </li>
       
        </ul>
    `;

  let to_modify = document.querySelector(`.welcome-message`);
  for (let token of tokens) {
    await new Promise(resolve => setTimeout(resolve, (Math.random() * (100 - 200) + 100)))
    to_modify.textContent += token;
  }
}
