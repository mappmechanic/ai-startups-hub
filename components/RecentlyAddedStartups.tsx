import Link from 'next/link'
import Image from 'next/image'
import { Star, ChevronRight } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useState, useEffect } from 'react'
import { IStartup } from '@/lib/types'
import { getAllStartups } from '@/lib/db'

  const getRandomColor = () => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

export default function RecentStartups() {
    const [topStartups, setTopStartups] = useState<IStartup[]>([])

    useEffect(() => {
        const fetchTopStartups = async () => {
            const startups = await getAllStartups({ recentlyAdded: true });
            setTopStartups(startups.slice(0, 3))  // Only keep the first 3 startups
        }

        fetchTopStartups()
    }, [])

    const truncateDescription = (description: string, maxLength: number) => {
        if (description.length <= maxLength) return description;
        return `${description.slice(0, maxLength)}...`;
    };

    return (
        <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center">
                <Star className="mr-2 h-8 w-8 text-yellow-500" />
                Recently Added Startups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {topStartups.map((startup, index) => (
                    <Card key={index} className="overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                                <div className={`${startup.color} p-3 rounded-full flex items-center justify-center`}>
                                    {startup.logoUrl ? (
                                        <Image
                                            src={startup.logoUrl}
                                            alt={`${startup.name} logo`}
                                            width={60}
                                            height={60}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <span className="text-white text-2xl font-bold">
                                            {startup.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-xl text-gray-900">{startup.name}</h3>
                                    <p className="text-sm text-indigo-600 font-medium">{startup.category}</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                {truncateDescription(startup.description, 150)}
                            </p>
                            <Button variant="outline" className="mt-4 w-full">Learn More</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="mt-8 text-center">
                <Link href="/startups" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                    Browse all startups
                    <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
            </div>
        </section>
    )
}