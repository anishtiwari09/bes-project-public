"use client";
import React from 'react'
import OTP from '../../../Form/otpinput'
import { redirect } from 'next/navigation';
import DownloadBadgePage from './component/download-badge-page';
import EmailAddressBox from './component/email-address-box';

export default function page(req) {
  let { slug } = req.params;
  const [slug1]=slug||[]
  if(slug1){
    // query database and get the data
    // if data is found then show masked email address with otp
    // and send otp to email address
  

    // else redirect to homepage
    // return redirect('/')

    return null
  }
  // if slug is not found then redirect to homepage
  // show email address input field 
  // and send otp to email address
  // verify then redirect with slug (which contain toke)



  return <DownloadBadgePage>
    <EmailAddressBox />
  </DownloadBadgePage>
}