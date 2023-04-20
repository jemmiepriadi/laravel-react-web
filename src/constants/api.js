export const BASE_URL = process.env.REACT_APP_API_URL;
export const API_V1 = BASE_URL + 'api/'

export const PENJUALAN_URL = API_V1 + 'penjualan'
export const PENJUALAN_ID_URL = (id) => PENJUALAN_URL + '/' + id

export const BARANG_URL = API_V1 + "barang"
export const BARANG_ID_URL = (id) => BARANG_URL + '/' + id

export const PELANGGAN_URL = API_V1 + 'pelanggan'
export const PELANGGAN_ID_URL = (id) => PELANGGAN_URL + '/' + id

export const ITEM_PENJUALAN_URL = API_V1 + 'item-penjualan'
export const ITEM_PENJUALAN_ID_URL = (id) => ITEM_PENJUALAN_URL + '/' + id