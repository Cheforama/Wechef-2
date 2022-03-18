import { create } from 'ipfs-http-client'

const ipfs = create('https://ipfs.infura.io:5001/api/v0')

export const IpfsStorage = async (file) => {

  try {
    const added = await ipfs.add(Buffer.from(file))
    return added;
  } catch (error) {
    // return false;
    console.log('Error uploading file: ', error)
  }
}
