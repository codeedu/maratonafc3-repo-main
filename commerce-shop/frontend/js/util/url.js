import {parse} from "psl";

const getCurrentDomain = () => {
    console.log(window.location.origin);
    const {domain} = parse(
        window.location.hostname
    );
    return `${domain}`
}

export const getAdminUrl = () => {
    const currentDomain = getCurrentDomain();
    const port = process.env.NODE_ENV === 'development' ? `:${process.env.MIX_DEV_ADMIN_PORT}` : "";
    if (process.env.MIX_MAIN_DOMAIN === currentDomain) {
        return `${window.domain.fallback_subdomain}-admin.${currentDomain}` + port;
    } else {
        return `admin.${window.domain.site}` + port;
    }
}
