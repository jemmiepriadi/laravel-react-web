import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <h4>Click pages below to navigate</h4>
        <div>
            <Link to={'/barang'}>Barang</Link>
        </div>
        <div>
            <Link to={'/item-penjualan'}>Item Penjualan</Link>
        </div>
        <div>
            <Link to={'/pelanggan'}>Pelanggan</Link>
        </div>
        <div>
            <Link to={'/penjualan'}>Penjual</Link>
        </div>
      </div>
    )
  }
}
