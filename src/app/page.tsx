import React from 'react'

const HomePage = () => {
  return (
    <div className="w-full h-full flex flex-col">
<main className="flex-1">
        <div className="py-8">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 overflow-x-auto whitespace-nowrap auto-scroll">
            <p className="text-center">
              <strong>Notice:</strong> This portal is for general information
              and awareness about the Indian Constitution. It is not a legal
              document.
            </p>
          </div>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center mb-6">
              Welcome to the Constitution of India Information Portal
            </h2>
            <p className="text-lg text-gray-700 mb-6 text-center">
              Explore the various sections and articles of the Indian
              Constitution. Gain insights into the laws that govern the
              country.
            </p>
            <div className="w-[200px] h-[200px] justify-center mx-auto p-10">
              <img
                src="/reshot-icon-india-YAP234SRF6.svg"
                alt="India Map"
                width={96}
                height={96}
                className="mx-auto"
              />
            </div>
            
          </div>
        </div>
      </main>

    </div>
  )
}

export default HomePage
