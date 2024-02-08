import Image from "next/image";

export default function Header() {
  return (
    <div className="bg-primary fixed w-full z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Image
                width={45}
                height={45}
                className="w-auto"
                src="/logo.png"
                alt="DipMax Export"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
