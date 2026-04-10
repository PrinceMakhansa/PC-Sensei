  import { Link } from 'react-router-dom'

  function Logo({ variant = 'default', className = '', onClick }) {
    const src = variant === 'dark' ? '/PCSensei_png_dark.png' : '/PCSensei.png'

    return (
      <Link
        to="/"
        className={`inline-flex items-center ${className}`.trim()}
        aria-label="PCSensei Home"
        onClick={onClick}
      >
        <img
          src={src}
          alt="PCSensei"
          className="h-9 w-auto object-contain"
        />
      </Link>
    )
  }

  export default Logo
