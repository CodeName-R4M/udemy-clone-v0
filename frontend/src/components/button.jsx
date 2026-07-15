
const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyle = "px-6 py-3 font-bold rounded transition-all cursor-pointer"
  const variants = {
    primary: "bg-primary-red text-white hover:bg-accent-red",
    secondary: "bg-primary-blue text-white hover:bg-accent-blue",
    outline: "bg-white text-primary-red border border-primary-red hover:bg-red-50",
  }

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button

