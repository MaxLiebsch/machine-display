import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface ImageProps {
  fill?: boolean;
  height?: number;
  width?: number;
  alt: string;
  style?: any
}

const ImageHandler = ({ fill = false, width, height, alt,src}: {src: string} & ImageProps) => {
  const [blobUrl, setBlobUrl] = useState<string>();
  useEffect(() => {
    fetch(src).then(async (response) => {
      if (response.ok) {
        if (response.headers.get('Content-Length') !== '17830') {
          setBlobUrl(URL.createObjectURL(await response.blob()));
        } 
      }
    });
  }, []);

  const imageProps: ImageProps = {
    fill,
    alt,
  };

  if (width) imageProps.width = width;
  if (height) imageProps.height = height;

  return (
    <Image
      blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkeGFSDwADqQGdRC70twAAAABJRU5ErkJggg=='
      placeholder='blur'
      src={blobUrl?? 'https://placehold.co/600x400'}
      {...imageProps}
      alt=''
    />
  );
};

export default ImageHandler;
