import React from 'react'
import Image from 'next/image'


export const Logo = () => {
  return (
    <Image src="/images/logo.svg" alt="Plameli Logo" width={43} height={57} priority />
  )
}
