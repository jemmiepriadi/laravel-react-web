import Axios from "axios";
import { BARANG_ID_URL, BARANG_URL } from "../constants/api";

export async function getAll() {
    return Axios.get(BARANG_URL);
}

export async function getById(id) {
    return Axios.get(BARANG_ID_URL(id))
}

export async function createOrUpdate(body){
    return Axios.post(BARANG_URL, body)
}

export async function deletebyId(id){
    return Axios.delete(BARANG_ID_URL(id))
}