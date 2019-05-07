import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import backend from "i18next-xhr-backend";

i18n
    .use(detector)
    .use(backend)
    .use(reactI18nextModule)
    .init({
        ns: ["common", "login", "main", "about"],
        defaultNS: "common",
        // debug: process.env.NODE_ENV === "development",
        interpolation: {
            escapeValue: false,
        },
        react: {
            wait: true,
        },
    });

export default i18n;
