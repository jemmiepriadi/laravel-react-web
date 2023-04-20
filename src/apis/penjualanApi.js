import Axios from "axios";
import { PENJUALAN_ID_URL, PENJUALAN_URL } from "../constants/api";

export async function getAll() {
    return Axios.get(PENJUALAN_URL);
}

export async function getById(id) {
    return Axios.get(PENJUALAN_ID_URL(id))
}

export async function createOrUpdate(body){
    return Axios.post(PENJUALAN_URL, body)
}

export async function deleteById(id) {
    return Axios.delete(PENJUALAN_ID_URL(id));
}