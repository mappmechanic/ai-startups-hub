import { useState } from 'react'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Zap, Briefcase, Globe, Phone, Building, MapPin, Image } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { addStartup } from '@/lib/db'
import { uploadImage } from '@/lib/storage'

function getBaseData() {
  return {
    name: '',
    description: '',
    website: '',
    phoneNumber: '',
    location: '',
    color: '#000000',
    category: '',
    foundedAt: new Date().toISOString().split('T')[0],
    foundingStage: '',
    employeeCount: 1,
    fundingAmount: 0,
    valuation: 0,
    logo: '',
    logoUrl: '',
    websiteUrl: '',
    jobListings: [],
    hqAddress: '',
    approved: false,
    rating: 0,
    numberOfRatings: 0,
  };
}

function AddCompanyFormContent() {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { toast } = useToast()
  const [formData, setFormData] = useState(getBaseData());
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }
    
    try {
      const token = await executeRecaptcha('submit_form');
      // Here you would typically send the token to your backend for verification
      console.log('reCAPTCHA token:', token);
      
      const startupData = {
        ...formData,
        websiteUrl: formData.website,
      };
      await addStartup(startupData);
      
      toast({
        title: "Success",
        description: "Company added successfully",
        action: <ToastAction altText="Close">Close</ToastAction>,
        className: 'bg-green-600 text-white',
        duration: 5000,
      })
      setFormData(getBaseData())
    } catch (error: any) {
      let errorMessage = "An error occurred while adding the company"
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Check Firestore rules.'
      } else if (error.code === 'unavailable') {
        errorMessage = 'Firestore is currently unavailable. Check your network connection.'
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImage(file);
        setFormData(prevState => ({
          ...prevState,
          logoUrl: imageUrl
        }));
        toast({
          title: "Success",
          description: "Logo uploaded successfully",
          className: 'bg-green-600 text-white',
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload logo",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

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
            <div>
              <label htmlFor="hqAddress" className="block text-sm font-medium text-gray-700 mb-1">HQ Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  id="hqAddress"
                  name="hqAddress"
                  placeholder="123 Main St, San Francisco, CA 94122"
                  className="pl-10"
                  value={formData.hqAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="url"
                  id="logoUrl"
                  name="logoUrl"
                  placeholder="https://example.com/logo.png"
                  className="pl-10"
                  value={formData.logoUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="logoFile" className="block text-sm font-medium text-gray-700 mb-1">Upload Logo</label>
              <Input
                type="file"
                id="logoFile"
                name="logoFile"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {isUploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isUploading}>
              Submit
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              This site is protected by reCAPTCHA and the Google
              <a href="https://policies.google.com/privacy" className="text-blue-500 hover:underline"> Privacy Policy</a> and
              <a href="https://policies.google.com/terms" className="text-blue-500 hover:underline"> Terms of Service</a> apply.
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default function AddCompanyForm() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <AddCompanyFormContent />
    </GoogleReCaptchaProvider>
  )
}