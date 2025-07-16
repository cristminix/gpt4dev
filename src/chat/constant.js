const chatBody = document.getElementById(`chatBody`);
const userInput = document.getElementById("userInput");
const codeButton = document.querySelector(".code");
const box_conversations = document.querySelector(`.top`);
const stop_generating = document.querySelector(`.stop_generating`);
const regenerate_button = document.querySelector(`.regenerate`);
const sidebar = document.querySelector(".sidebar");
const sidebar_buttons = document.querySelectorAll(".mobile-sidebar-toggle");
const sendButton = document.getElementById("sendButton");
const addButton = document.getElementById("addButton");
const imageInput = document.querySelector(".image-label");
const mediaSelect = document.querySelector(".media-select");
const imageSelect = document.getElementById("image");
const cameraInput = document.getElementById("camera");
const audioButton = document.querySelector(".capture-audio");
const linkButton = document.querySelector(".add-link");
const fileInput = document.getElementById("file");
const microLabel = document.querySelector(".micro-label");
const inputCount = document.getElementById("input-count").querySelector(".text");
const providerSelect = document.getElementById("provider");
const modelSelect = document.getElementById("model");
const modelProvider = document.getElementById("model2");
const custom_model = document.getElementById("model3");
const chatPrompt = document.getElementById("chatPrompt");
const settings = document.querySelector(".settings");
const chat = document.querySelector(".chat-container");
const album = document.querySelector(".images");
const log_storage = document.querySelector(".log");
const switchInput = document.getElementById("switch");
const searchButton = document.getElementById("search");
const paperclip = document.querySelector(".user-input .fa-paperclip");
const hide_systemPrompt = document.getElementById("hide-systemPrompt")
const slide_systemPrompt_icon = document.querySelector(".slide-header i");
const pin_container = document.getElementById("pin_container");

const optionElementsSelector = ".settings input, .settings textarea, .chat-body input, #model, #model2, #provider";
const translationSnipptes = [
  "with", "**An error occured:**", "Private Conversation", "New Conversation", "Regenerate", "Continue",
  "Hello! How can I assist you today?", "words", "chars", "tokens", "{0} total tokens",
  "{0} Messages were imported", "{0} File(s) uploaded successfully",
  "{0} Conversations/Settings were imported successfully",
  "No content found", "Files are loaded successfully",
  "Importing conversations...", "New version:", "Providers API key", "Providers (Enable/Disable)",
  "Get API key", "Uploading files...", "Invalid link"
];

const login_urls_storage = {
  "HuggingFace": ["HuggingFace", "https://huggingface.co/settings/tokens", ["HuggingFaceMedia"]],
  "HuggingSpace": ["HuggingSpace", "", []],
  "PollinationsAI": ["Pollinations AI", "https://auth.pollinations.ai", ["Live"]],
  "Puter": ["Puter.js", "", []],
};

const modelTags = {
  image: "📸 Image Generation",
  vision: "👓 Image Upload",
  audio: "🎧 Audio Generation",
  video: "🎥 Video Generation"
}
export {
  translationSnipptes,
  login_urls_storage,
  modelTags,
  chatBody,
  userInput,
  codeButton,
  box_conversations,
  stop_generating,
  regenerate_button,
  sidebar,
  sidebar_buttons,
  sendButton,
  addButton,
  imageInput,
  mediaSelect,
  imageSelect,
  cameraInput,
  audioButton,
  linkButton,
  fileInput,
  microLabel,
  inputCount,
  providerSelect,
  modelSelect,
  modelProvider,
  custom_model,
  chatPrompt,
  settings,
  chat,
  album,
  log_storage,
  switchInput,
  searchButton,
  paperclip,
  hide_systemPrompt,
  slide_systemPrompt_icon,
  optionElementsSelector, pin_container
};