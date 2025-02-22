import ModalContainer from '@/components/modal-container'
import Image from 'next/image'

type PaymentProofImageModalProps = {
  image: string
  isOpen: boolean
  handleClose: () => void
}

export default function PaymentProofImageModal({
  image,
  isOpen,
  handleClose
}: PaymentProofImageModalProps) {
  return (
    <ModalContainer isOpen={isOpen} handleClose={handleClose}>
      <Image
        src={image}
        alt='Bukti pembayaran'
        width={500}
        height={500}
        className='aspect-auto h-auto max-h-[80vh] w-auto max-w-[80vw]'
      />
    </ModalContainer>
  )
}
