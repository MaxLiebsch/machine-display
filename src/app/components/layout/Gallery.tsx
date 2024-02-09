'use client'
import React from "react";
import ReactImageGallery from "react-image-gallery";

const Gallery = ({ images }: { images: any }) => {
  return <ReactImageGallery items={images} />;
};

export default Gallery;
