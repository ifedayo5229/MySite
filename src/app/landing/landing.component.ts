import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  darkMode = false;
  isSubmitting = false;
  
  private formspreeEndpoint = 'https://formspree.io/f/mykzweyb';

  constructor(private http: HttpClient) {}
  
  
  skills = {
    frontend: ['Angular', 'React', 'HTML5', 'CSS3', 'JavaScript', 'jQuery', 'TypeScript'],
    backend: ['C#', 'ASP.NET Core', 'ASP.NET MVC', 'ASP.NET WebForms', 'Entity Framework', 'REST APIs'],
    database: ['SQL Server', 'MySQL', 'Stored Procedures', 'Database Design'],
    tools: ['Git', 'Postman', 'CI/CD', 'Agile/Scrum', 'Azure DevOps']
  };

  experiences = [
    {
      company: 'Lafarge Africa Plc',
      position: 'Application Developer & Application Support',
      period: '2024 - Present',
      description: 'Contributing to the full software development life-cycle, from requirements gathering and scoping to implementation, deployment, and ongoing support.',
      highlights: [
        'Building robust and scalable RESTful APIs and endpoints',
        'Full Stack Development with Angular and ASP.NET Core',
        'Database Management with SQL Server and MySQL',
        'Application Deployment using CI/CD pipelines',
        'Cross-functional collaboration with product managers and QA teams'
      ]
    },
    {
      company: 'Strategic Data for Software Development (SDSD)',
      position: 'Software Developer',
      period: '2022 - 2024',
      description: 'Drove innovation on Maritime Access Management System (MAMS), delivering new features and ensuring seamless maintenance of web applications.',
      highlights: [
        'Delivered new features for Maritime Access Management System',
        'Debugged and resolved complex issues maintaining application reliability',
        'Crafted clean and efficient code for deployment and automation',
        'Participated in cross-functional Agile teams'
      ]
    },
    {
      company: 'Infosight Limited',
      position: 'Software Developer',
      period: '2022',
      description: 'Contributed to Prime Core Banking Application development and significant software upgrades.',
      highlights: [
        'Crafted background services using .NET framework',
        'Executed software upgrades for Prime Core Banking Application',
        'Leveraged stored procedures to optimize database interactions',
        'Provided technical support and training to team members'
      ]
    },
    {
      company: 'Software Business Solutions Consulting (SBSC)',
      position: 'Software Developer (Intern)',
      period: '2021',
      description: 'Contributed to development of comprehensive e-commerce platform capstone project.',
      highlights: [
        'Collaborated on e-commerce platform development',
        'Delivered problem-solving solutions and prototypes',
        'Applied skills in real-world team setting'
      ]
    }
  ];
  
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  navigateToSocial(platform: string): void {
    const socialLinks: { [key: string]: string } = {
      linkedin: 'https://www.linkedin.com/in/oluwaseun-ifedayo-ademodi-6268a6146/',
      github: 'https://github.com/ifedayo5229?tab=repositories',
      email: 'mailto:ademodiseun@gmail.com'
    };
    
    if (socialLinks[platform]) {
      window.open(socialLinks[platform], '_blank');
    }
  }

  downloadResume(): void {
    window.open('assets/resume/Ifedayo-Ademodi\'s-cv.pdf', '_blank');
  }

  onSubmitContactForm(form: any): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = {
        name: form.value.name,
        email: form.value.email,
        subject: form.value.subject,
        message: form.value.message
      };

      this.http.post(this.formspreeEndpoint, formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          alert('Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
          form.reset();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Form submission error:', error);
          alert('Oops! Something went wrong. Please try again or email me directly at ademodiseun@gmail.com');
        }
      });
    }
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
  }
}
