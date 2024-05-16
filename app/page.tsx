import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'

export default async function Page() {

  console.log("page ran")
  const session = await getServerSession();
  if (session?.user) {
    console.log("redirected to dashboard")
    redirect('/dashboard')

  } else {
    console.log("redirect to signin page")
    redirect('/signin')
  }
  
}