
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted dark:bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Aman Singh</h3>
            <p className="text-muted-foreground mb-4">
              Data Scientist & Process Optimization Specialist with a passion for leveraging technology to drive business growth.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:aman.singh01031997@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                  aman.singh01031997@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+919340474252" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 93404 74252
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Gurugram, Haryana</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a 
                href="https://linkedin.com/in/aman-singh-10a060217"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-primary" />
              </a>
              <a 
                href="https://github.com/its-aman4u"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Github className="w-5 h-5 text-primary" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Aman Singh. All rights reserved.
          </p>
          <a 
            href="https://drive.google.com/file/d/1XiczZvGjJeaSTUxlIz_M_J9DgtsclVMa/view?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-4 md:mt-0"
          >
            Download CV
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
