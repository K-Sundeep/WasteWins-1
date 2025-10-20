import { motion } from 'framer-motion';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import wasteWinsLogo from 'figma:asset/64842a1307aaa63c3be652b7db9827f80be7ab2a.png';

export function Footer() {
  const footerLinks = {
    Platform: [
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'Rewards Store', href: '#rewards' },
      { name: 'Impact Tracker', href: '#impact' },
      { name: 'Pickup Scheduler', href: '#pickup' },
    ],
    Support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Community Guidelines', href: '#' },
      { name: 'Safety Guidelines', href: '#' },
    ],
    Company: [
      { name: 'About Us', href: '#' },
      { name: 'Partner Factories', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press Kit', href: '#' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Data Protection', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src={wasteWinsLogo} 
                    alt="WASTE WINS" 
                    className="w-full h-full object-contain"
                    style={{
                      filter: 'brightness(0) invert(1)',
                      mixBlendMode: 'normal'
                    }}
                  />
                </div>
                <span className="text-4xl font-black">WASTE WINS</span>
              </div>
              
              <p className="text-background/80 max-w-md leading-relaxed">
                Transforming waste into rewards while creating sustainable communities. 
                Join thousands of users making a positive environmental impact every day.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-background/80">
                  <Mail className="w-4 h-4" />
                  <span>hello@wastewins.eco</span>
                </div>
                <div className="flex items-center space-x-3 text-background/80">
                  <Phone className="w-4 h-4" />
                  <span>+91 7396344114</span>
                </div>
                <div className="flex items-center space-x-3 text-background/80">
                  <MapPin className="w-4 h-4" />
                  <span>HITEC City, Hyderabad, Telangana 500081</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-lg">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-background/80 hover:text-background transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="py-8 border-t border-background/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-background/80">Get the latest news on sustainability and rewards.</p>
            </div>
            <div className="flex space-x-2 w-full md:w-auto max-w-md">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-background/60 text-sm">
              © 2024 WASTE WINS. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-background/60">
              <span>Made with 💚 for a sustainable future</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}