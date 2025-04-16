export async function loadRazorpay() {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if ((window as any).Razorpay) {
      console.log('Razorpay is already loaded');
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Razorpay script:', error);
      reject(new Error("Failed to load Razorpay"));
    };
    
    document.body.appendChild(script);
  });
} 