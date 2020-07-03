import axios from 'axios';
import {getAdminUrl} from "../util/url";

export const httpShop = axios.create({
    baseURL: '/'
});


const ADMIN_URL = getAdminUrl();

export const httpAdmin = axios.create({
    baseURL: `${window.location.protocol}//${ADMIN_URL}/api`
});
