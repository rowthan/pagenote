
export default function DonationCard() {
    return(

        <div className="container">
            <div
                className="card bg-white shadow-xl p-6 mt-20 text-center rounded-xl max-w-4xl mx-auto md:flex md:gap-x-6 md:text-left mb-5"
            >
                <div className="img-container mx-auto max-w-[16rem] md:mx-0 md:self-center">
                    <img
                        src="https://raw.githubusercontent.com/bradtraversy/tailwind-course-projects/main/all-project-assets/product-modal/images/headphone.png"
                        alt="Headphones"
                        className="w-full hover:scale-105 transition-transform duration-200"
                    />
                </div>
                <div className="card-content">
                    <small
                        className="bg-black text-white text-sm py-1 px-3 capitalize rounded-full inline-block mx-auto mt-8"
                    >Free Shipping</small
                    >
                    <h3 className="font-semibold text-2xl mt-4 mb-4 max-w-sm mx-auto md:mx-0">
                        Razer Kraken Kitty Edt Gaming Headset Quartz
                    </h3>
                    <small className="text-base line-through">$799</small>
                    <span className="text-4xl font-bold">$599</span>
                    <p className="mt-4 mb-4 text-sm text-gray-400">
                        This offer is valid until April 3rd or as long as stock lasts!
                    </p>
                    <div className="group mb-4">
                        <div
                            className="button-container bg-blue-700 rounded-xl overflow-hidden group cursor-pointer transition-shadow hover:shadow-lg"
                        >
                            <button
                                className="bg-blue-500 p-4 pt-6 w-full text-white rounded-b-xl transition-all -translate-y-2 group-hover:translate-y-0 hover:bg-blue-800"
                            >
                                Add to cart
                            </button>
                        </div>
                        <div className="text-left mt-3">
              <span
                  className="inline-block w-3 h-3 mr-2 rounded-full bg-green-500 group-hover:animate-ping"
              ></span>
                            <small className="text-sm">50+ pcs. in stock</small>
                        </div>
                    </div>
                    <div className="button-container space-y-4 md:space-y-0 md:flex gap-x-4">
                        <button
                            className="p-3 border-2 border-slate-300 rounded-xl w-full flex items-center justify-center hover:-translate-y-1 transition-all hover:shadow-xl duration-200"
                        >
                            <img
                                src="https://raw.githubusercontent.com/bradtraversy/tailwind-course-projects/main/all-project-assets/product-modal/images/weight.png"
                                className="w-8 mr-4"/>
                            <span>Add to cart</span>
                        </button>
                        <button
                            className="p-3 border-2 border-slate-300 rounded-xl w-full flex items-center justify-center hover:-translate-y-1 transition-all hover:shadow-xl duration-200"
                        >
                            <img
                                src="https://raw.githubusercontent.com/bradtraversy/tailwind-course-projects/main/all-project-assets/product-modal/images/heart.png"
                                className="w-8 mr-4"/>
                            <span>Add wish list</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
