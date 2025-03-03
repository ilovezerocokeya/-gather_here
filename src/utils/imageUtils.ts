
export const secureImageUrl = (url: string | null) =>
    url ? url.replace(/^http:/, "https:") : "/assets/header/user.svg";