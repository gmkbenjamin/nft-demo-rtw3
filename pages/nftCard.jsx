export const NFTCard = ({ nft }) => {

  const copyText = async (event) => { 
    navigator.clipboard.writeText(event.currentTarget.value);

}
    return (
      <div className="w-1/4 flex flex-col ">
        <div className="rounded-md">
          <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img>
        </div>
        <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
          <div className="">
            <h2 className="text-xl text-gray-800">{nft.title}</h2>
            <p className="text-gray-600">Id: {nft.id.tokenId}</p>
            <br/>
            <button value={nft.contract.address} onClick={copyText}><img src='copy-svgrepo-com.svg' width="20" height="20"/></button><p className="text-gray-600">{nft.contract.address}</p>
          </div>
  
          <div className="flex-grow mt-2">
            <p className="text-gray-600">{nft.description}</p>
          </div>
        </div>
  
      </div>
    )
  }