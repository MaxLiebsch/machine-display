import { product } from "@/app/product/[...slug]/page";
import Image from "next/image";

export default function PhotoPage ({params}){
    const photo = product.images.find(photo => photo.id === params.id)
    console.log('photo:', photo)
    return <Image alt={photo?.alt ?? 'failed'} src={photo?.src ?? ''}/>
}