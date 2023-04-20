import Axios from "axios";
import { PELANGGAN_ID_URL, PELANGGAN_URL } from "../constants/api";

export async function getAll() {
    return Axios.get(PELANGGAN_URL);
}

export async function getById(id) {
    return Axios.get(PELANGGAN_ID_URL(id))
}

export async function createOrUpdate(body){
    return Axios.post(PELANGGAN_URL, body)
}

export async function deleteById(id) {
    return Axios.delete(PELANGGAN_ID_URL(id))
}