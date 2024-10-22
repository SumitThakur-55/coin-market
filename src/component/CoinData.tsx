import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CoinDetail from './coinDetail';

export default function CoinData() {
    const { id } = useParams<{ id: string }>();
    return (
        <div>

            <h1 className='bg-white text-black'>coin data {id} </h1>
            <CoinDetail id={id} />
        </div>
    )
}
