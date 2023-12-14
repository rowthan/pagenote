export default function Discount() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative w-64">
        <div className="absolute -right-4 -bottom-4 bg-yellow-400 h-full w-full rounded-xl"></div>

        <div className="relative bg-gray-800 text-gray-50 rounded-xl p-8 space-y-7">
          <div className="h-2 w-20 bg-yellow-400"></div>

          <div className="text-5xl font-extrabold text-white">95%</div>

          <p className="leading-snug text-gray-400">
            Pagespeed Insights Score. Delight your users and improve your SERP
            positioning.
          </p>

          <a href="#" className="text-yellow-400 font-bold tracking-wide flex">
            <span>Learn More</span>
            <svg
              className="w-4 h-4 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
