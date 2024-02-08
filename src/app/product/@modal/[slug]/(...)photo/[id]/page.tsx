import { Dialog } from "@headlessui/react";

export default function PhotoModal({ params }: {params: {slug: string}}) {
  return (
    <Dialog open={true} onClose={() => {}}>
      <Dialog.Panel>
        <Dialog.Title>PhotoModal</Dialog.Title>
        <Dialog.Description>
           Photo Modal content
        </Dialog.Description>

        <p>
          Coming soon.
        </p>

        {/* <button onClick={() => setIsOpen(false)}>Deactivate</button>
      <button onClick={() => setIsOpen(false)}>Cancel</button> */}
      </Dialog.Panel>
    </Dialog>
  );
}
