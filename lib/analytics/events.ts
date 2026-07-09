export const AnalyticsEvents = {
  APP_OPEN: "app_open",

  INSTALL_PROMPT_SHOWN: "install_prompt_shown",
  INSTALL_BUTTON_CLICKED: "install_button_clicked",
  INSTALL_PROMPT_ACCEPTED: "install_prompt_accepted",
  INSTALL_PROMPT_DISMISSED: "install_prompt_dismissed",
  PWA_INSTALLED: "pwa_installed",

  BROCHURE_DOWNLOAD: "brochure_download",

  REGISTRATION_STARTED: "registration_started",
  REGISTRATION_COMPLETED: "registration_completed",

  MENU_CLICK: "menu_click",

  CONTACT_FORM_SUBMIT: "contact_form_submit",
  PHONE_CLICK: "phone_click",
  EMAIL_CLICK: "email_click",

  SEARCH: "search",

  SPEAKER_VIEW: "speaker_view",

  DOWNLOAD: "download",

  OUTBOUND_CLICK: "outbound_click",
} as const;
