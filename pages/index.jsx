import { NFTCard } from "./nftCard"
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection] = useState(false)

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    const api_key = "tRbMrA-Vk7RD1zQiBHJ4BdAvGNVmXhpw"
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    var requestOptions = {
      method: 'GET'
    };

    if (!collection.length) {

      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log(nfts.pageKey);
      var morenfts = nfts;
      var nextpage = true;
      while (nextpage){
        console.log("fetching next page");
        var newfetchURL = `${baseURL}?owner=${wallet}&pageKey=${morenfts.pageKey}`;
        morenfts = await fetch(newfetchURL, requestOptions).then(data => data.json())
        if(typeof morenfts.pageKey === "undefined"){
          nextpage = false;
        }
        nfts.ownedNfts = nfts.ownedNfts.concat(morenfts.ownedNfts);
      }
      
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = "tRbMrA-Vk7RD1zQiBHJ4BdAvGNVmXhpw"
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        var morenfts = nfts;
        var nextpage = true;
        while (nextpage){
          console.log("fetching next page");
          var newfetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${morenfts.nextToken}`;
          console.log(newfetchURL);
          morenfts = await fetch(newfetchURL, requestOptions).then(data => data.json())
          if(typeof morenfts.nextToken === "undefined"){
            nextpage = false;
          }
          console.log(morenfts.nfts)
          nfts.nfts = nfts.nfts.concat(morenfts.nfts);
          console.log(nfts.nfts);
          console.log(morenfts.nextToken);
        }
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
      }
    }
  }
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-state-50 disabled:text-gray-50" disabled={fetchForCollection} onChange={(e) => { setWalletAddress(e.target.value) }} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-state-50 disabled:text-gray-50" type={"text"} onChange={(e) => { setCollectionAddress(e.target.value) }} value={collection} placeholder="Add the collection address"></input>
        <label  className="text-gray-600 "><input onChange={(e) => { setFetchForCollection(e.target.checked) }} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection()
            } else fetchNFTs()
          }
        }>Let's go! </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home