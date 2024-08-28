import { useState } from 'react'
import { Zap, Briefcase, Globe, Phone, Building } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function AddCompanyForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    phoneNumber: '',
    location: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'companies'), formData)
      // Show success toast
      toast({
        title: "Success",
        description: "Company added successfully",
        action: <ToastAction altText="Close">Close</ToastAction>,
        className: 'bg-green-600 text-white',
        duration: 5000,
      })
      setFormData({
        name: '',
        description: '',
        website: '',
        phoneNumber: '',
        location: '',
      })
    } catch (error: any) {
      let errorMessage = "An error occurred while adding the company"
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Check Firestore rules.'
      } else if (error.code === 'unavailable') {
        errorMessage = 'Firestore is currently unavailable. Check your network connection.'
      }
      // Show error toast
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  }

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center">
        <Zap className="mr-2 h-8 w-8 text-yellow-500" />
        Add a company
      </h2>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
    <div className="relative">
      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        id="name"
        name="name"
        placeholder="Enter company name"
        className="pl-10"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </div>
  </div>
  <div>
    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
    <Textarea
      id="description"
      name="description"
      placeholder="Write about the company"
      value={formData.description}
      onChange={handleChange}
      required
      className="h-24"
    />
  </div>
  <div>
    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
    <div className="relative">
      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="url"
        id="website"
        name="website"
        placeholder="www.company.com"
        className="pl-10"
        value={formData.website}
        onChange={handleChange}
        required
      />
    </div>
  </div>
  <div>
    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
    <div className="relative">
      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="tel"
        id="phoneNumber"
        name="phoneNumber"
        placeholder="Phone number"
        className="pl-10"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
    </div>
  </div>
  <div>
    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
    <div className="relative">
      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        id="location"
        name="location"
        placeholder="San Francisco, CA"
        className="pl-10"
        value={formData.location}
        onChange={handleChange}
        required
      />
    </div>
  </div>
  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Submit</Button>
</form>
        </CardContent>
      </Card>
    </section>
  )
}