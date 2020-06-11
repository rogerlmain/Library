import database from "./database.mjs";
import {base64_encode} from "../Common/encoding.mjs";


export async function register_user (data) {

    data ["token"] = base64_encode (data.token);
    new database ().save ("users", data);

}// register_user;