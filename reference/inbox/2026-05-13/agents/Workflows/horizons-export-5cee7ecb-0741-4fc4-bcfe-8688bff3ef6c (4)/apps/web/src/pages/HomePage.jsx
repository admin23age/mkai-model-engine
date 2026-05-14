import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid business email"),
  businessName: z.string().min(2, "Business name is required"),
  primaryService: z.string().min(1, "Please select a primary service"),
  addons: z.array(z.string()).default([]),
  needs: z.string().optional(),
});

const serviceUrls = {
  "full-ai-audit": "https://calendly.com/mankindaitech-support/full-ai-audit",
  "ai-snapshot": "https://calendly.com/mankindaitech-support/ai-snapshot",
  "ai-readiness": "https://calendly.com/mankindaitech-support/ai-readiness-assessment-clone",
  "ai-governance": "https://calendly.com/mankindaitech-support/ai-governance",
  "sop-development": "https://calendly.com/mankindaitech-support/add-on-sop-development",
  "training-materials": "https://calendly.com/mankindaitech-support/add-on-training-material"
};

const addonUrls = {
  "sop-development": {
    name: "SOP Development",
    url: "https://calendly.com/mankindaitech-support/add-on-sop-development"
  },
  "training-materials": {
    name: "AI Training Materials",
    url: "https://calendly.com/mankindaitech-support/add-on-training-material"
  }
};

const HomePage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAddons, setSubmittedAddons] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      businessName: "",
      primaryService: "",
      addons: [],
      needs: "",
    },
  });

  const onSubmit = (data) => {
    const primaryUrl = serviceUrls[data.primaryService];
    
    if (primaryUrl) {
      // Open primary service booking in a new tab
      window.open(primaryUrl, '_blank');
    }
    
    setSubmittedAddons(data.addons);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{`Man Kind AI | Your human ally in the age of AI`}</title>
        <meta name="description" content="Practical AI support and implementation for small to mid-size businesses." />
      </Helmet>

      <Header />

      <main className="flex-grow pt-24">
        {/* HERO SECTION */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10"></div>
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="label-teal">Small Business AI Support</span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                  Your human ally <span className="text-primary">in the age of AI</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  We help businesses move from confusion to action. No jargon, no overwhelm—just practical AI implementation that drives real growth.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                  <a href="#contact" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20">
                    Start with a free discovery call
                  </a>
                  <a href="#services" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-border text-foreground rounded-full font-semibold hover:border-primary hover:text-primary transition-all active:scale-[0.98]">
                    Explore services
                  </a>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
              >
                {[
                  { title: "7 Core", desc: "and add-on service offers" },
                  { title: "4 Tiers", desc: "of pricing to support growth" },
                  { title: "1:1 Support", desc: "practical & tailored to you" }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.title}</div>
                    <div className="text-sm text-muted-foreground">{stat.desc}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="max-w-3xl mb-16">
              <span className="label-teal">About</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for businesses that want real progress, not AI overwhelm.</h2>
              <p className="text-lg text-muted-foreground">
                We bridge the gap between complex AI technology and everyday business operations. Our approach is rooted in understanding your unique challenges and applying the right tools to solve them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-card border border-border">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  What makes this different
                </h3>
                <ul className="space-y-4">
                  {['Clear, jargon-free language', 'Affordable entry points', 'Action-focused delivery', 'Practical implementation', 'Ongoing, human-led support'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-8 rounded-3xl bg-card border border-border">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  Best fit for
                </h3>
                <ul className="space-y-4">
                  {['Small to mid-size businesses', 'Teams new to AI integration', 'Companies seeking operational clarity', 'Growth-focused organizations'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="section-padding">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-16">
              <span className="label-teal">Services</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Seven services, presented in a simpler format.</h2>
              <p className="text-lg text-muted-foreground">
                Explore our core offerings designed to take you from initial strategy to ongoing optimization.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                { num: "01", title: "AI Strategy & Roadmap", desc: "Comprehensive assessment of your current operations and a tailored plan for AI integration." },
                { num: "02", title: "Implementation Support", desc: "Hands-on assistance setting up and configuring AI tools within your existing workflows." },
                { num: "03", title: "Team Training", desc: "Customized workshops to ensure your staff is confident and capable of using new AI systems." },
                { num: "04", title: "Process Optimization", desc: "Refining and automating repetitive tasks to save time and reduce operational costs." },
                { num: "05", title: "Custom Integrations", desc: "Connecting disparate software systems to create a seamless flow of data and actions." },
                { num: "06", title: "Performance Monitoring", desc: "Tracking the ROI and effectiveness of implemented AI solutions with regular reporting." },
                { num: "07", title: "Ongoing Advisory", desc: "Continuous strategic guidance as AI technology evolves and your business grows." }
              ].map((service, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-2xl px-6 overflow-hidden">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-6 text-left">
                      <span className="text-2xl font-bold text-primary/50">{service.num}</span>
                      <span className="text-xl font-semibold">{service.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 pl-14 text-base">
                    {service.desc}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* HOW IT WORKS & WHY US */}
        <section id="how-it-works" className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="mb-24">
              <div className="text-center mb-16">
                <span className="label-teal">How It Works</span>
                <h2 className="text-3xl md:text-4xl font-bold">A simple path from interest to implementation.</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: "1", title: "Discovery", desc: "We discuss your goals and current bottlenecks." },
                  { step: "2", title: "Assessment", desc: "We analyze your workflows for AI opportunities." },
                  { step: "3", title: "Recommendations", desc: "You receive a clear, actionable roadmap." },
                  { step: "4", title: "Support", desc: "We help you implement and train your team." }
                ].map((item, i) => (
                  <div key={i} className="relative p-6 rounded-2xl bg-card border border-border">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mb-6">
                      {item.step}
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="why-us">
              <div className="mb-12">
                <span className="label-teal">Why Man Kind AI</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Support built for clarity, adoption, and growth.</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-8 rounded-3xl bg-card border border-border">
                    <h4 className="text-xl font-semibold mb-3">Clear language</h4>
                    <p className="text-muted-foreground">We translate complex technical concepts into business terms you actually understand.</p>
                  </div>
                  <div className="p-8 rounded-3xl bg-card border border-border">
                    <h4 className="text-xl font-semibold mb-3">Affordable entry</h4>
                    <p className="text-muted-foreground">Start small with high-impact projects before committing to massive transformations.</p>
                  </div>
                  <div className="p-8 rounded-3xl bg-card border border-border sm:col-span-2">
                    <h4 className="text-xl font-semibold mb-3">Action-focused delivery</h4>
                    <p className="text-muted-foreground">We don't just hand you a report. We build, implement, and ensure your team actually uses the tools.</p>
                  </div>
                </div>
                
                <div className="p-8 rounded-3xl bg-primary text-primary-foreground flex flex-col justify-center">
                  <h4 className="text-2xl font-bold mb-6">Positioning Summary</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-80" />
                      <span>Human-first approach to technology</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-80" />
                      <span>Tailored to small/mid-size scale</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-80" />
                      <span>Focus on practical ROI</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-16">
              <span className="label-teal">Pricing</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Four tiers to support different stages of growth.</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparent pricing designed to scale with your needs and budget.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Starter", price: "$197", desc: "Perfect for initial exploration.", features: ["1hr Strategy Session", "Basic AI Audit", "Action Plan Document"] },
                { name: "Growth", price: "$597", desc: "For teams ready to implement.", features: ["Everything in Starter", "Tool Setup & Config", "1 Team Training Session", "30 Days Email Support"], popular: true },
                { name: "Build", price: "Custom", desc: "Complex, scope-based projects.", features: ["Custom Integrations", "Process Automation", "Advanced Training", "Dedicated Project Manager"] },
                { name: "Sustain", price: "$299/mo", desc: "Ongoing advisory and support.", features: ["Monthly Strategy Call", "Performance Monitoring", "Priority Email Support", "New Tool Updates"] }
              ].map((tier, i) => (
                <div key={i} className={`relative flex flex-col p-8 rounded-3xl bg-card border ${tier.popular ? 'border-primary ring-1 ring-primary shadow-xl scale-105 z-10' : 'border-border'}`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold mb-4">{tier.price}</div>
                  <p className="text-sm text-muted-foreground mb-8 flex-grow">{tier.desc}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href="#contact" 
                    className={`w-full py-3 rounded-xl font-semibold text-center transition-all ${tier.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                  >
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT FORM SECTION */}
        <section id="contact" className="section-padding bg-muted/30">
          <div className="container-custom max-w-3xl">
            <div className="text-center mb-12">
              <span className="label-teal">Contact</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Tell us what kind of help you need.</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fill out the form below to book your discovery call. We'll redirect you to schedule a time that works for you.
              </p>
            </div>
            
            <div className="bg-card p-8 md:p-10 rounded-3xl border border-border shadow-xl">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Thank you!</h3>
                  <p className="text-muted-foreground mb-8">
                    We've opened a new tab for you to book your primary service call via Calendly.
                  </p>
                  
                  {submittedAddons.length > 0 && (
                    <div className="bg-muted/50 rounded-2xl p-6 text-left border border-border">
                      <h4 className="font-semibold mb-4">Don't forget to book your selected add-ons:</h4>
                      <div className="space-y-3">
                        {submittedAddons.map((addonKey) => {
                          const addon = addonUrls[addonKey];
                          if (!addon) return null;
                          return (
                            <a 
                              key={addonKey}
                              href={addon.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-primary transition-colors group"
                            >
                              <span className="font-medium">{addon.name}</span>
                              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => {
                      setIsSubmitted(false);
                      form.reset();
                    }}
                    className="mt-8 text-sm text-primary hover:underline"
                  >
                    Submit another request
                  </button>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jane@company.com" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Corp" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="primaryService"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Service</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select a service to book" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full-ai-audit">Full AI Audit</SelectItem>
                              <SelectItem value="ai-snapshot">AI Snapshot</SelectItem>
                              <SelectItem value="ai-readiness">AI Readiness Assessment</SelectItem>
                              <SelectItem value="ai-governance">AI Governance & Policy</SelectItem>
                              <SelectItem value="sop-development">SOP Development (add-on)</SelectItem>
                              <SelectItem value="training-materials">AI Training Materials (add-on)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addons"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Optional Add-Ons</FormLabel>
                          </div>
                          <div className="space-y-3">
                            <FormField
                              control={form.control}
                              name="addons"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key="sop-development"
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border p-4 bg-background"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("sop-development")}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, "sop-development"])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== "sop-development"
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer w-full">
                                      SOP Development
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                            <FormField
                              control={form.control}
                              name="addons"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key="training-materials"
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border p-4 bg-background"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("training-materials")}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, "training-materials"])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== "training-materials"
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer w-full">
                                      AI Training Materials
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="needs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tell Us About Your Needs</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Briefly describe what you're looking to achieve with AI..." 
                              className="min-h-[120px] bg-background resize-y" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <button 
                      type="submit" 
                      className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      Continue to Booking <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;