import Axios from "axios";
import { ITEM_PENJUALAN_ID_URL, ITEM_PENJUALAN_URL } from "../constants/api";

export async function getAll() {
    return Axios.get(ITEM_PENJUALAN_URL);
}

export async function getById(id) {
    return Axios.get(ITEM_PENJUALAN_ID_URL(id))
}

export async function createOrUpdate(body){
    return Axios.post(ITEM_PENJUALAN_URL, body)
}

export async function deleteById(id) {
    return Axios.delete(ITEM_PENJUALAN_ID_URL(id));
}