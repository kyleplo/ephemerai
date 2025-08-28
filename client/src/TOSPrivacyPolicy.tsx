import { Link, Typography } from "@mui/material";
import React from "react";

export function PrivacyPolicy(props: {productName: string, email: string}) {
  return <>
    <div>
      <Typography><strong>Last Updated:</strong> August 15, 2025</Typography>
    </div>
    <div>
      <Typography>This Privacy Policy describes how {props.productName} ("we," "us," or "our") collects, uses, and shares personal information when you use Our Website (referred to as the "Website" or "Service").</Typography>

      <Typography>By accessing or using our Service, you agree to this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.</Typography>
    </div>
    <div>
      <Typography component="h3" variant="h5">Table of Contents</Typography>
      <ol>
        <li><Typography>Information We Collect</Typography></li>
        <li><Typography>How We Use Your Information</Typography></li>
        <li><Typography>How We Share Your Information</Typography></li>
        <li><Typography>Your Privacy Rights</Typography></li>
        <li><Typography>Data Security</Typography></li>
        <li><Typography>International Data Transfers</Typography></li>
        <li><Typography>Children's Privacy</Typography></li>
        <li><Typography>Changes to This Privacy Policy</Typography></li>
        <li><Typography>Contact Us</Typography></li>
      </ol>
    </div>

    <div>
      <Typography component="h3" variant="h5">1. Information We Collect</Typography>
      <Typography>We collect information in the following ways:</Typography><ul><li><Typography><strong>Information You Provide to Us:</strong> Information that you provide when you fill out forms, communicate with us, or otherwise use our Service.</Typography></li><li><Typography><strong>Automatically Collected Information:</strong> Information collected automatically through cookies and similar technologies when you use our Service.</Typography></li></ul><Typography>The types of personal information we may collect include:</Typography><ul><li><Typography><strong>Device Information:</strong> Such as your IP address, browser type and version, operating system, and other technical information about the device you use to access our Service.</Typography></li><li><Typography><strong>Usage Information:</strong> Such as how you interact with our Service, including pages visited, features used, time spent, and other similar information.</Typography></li><li><Typography><strong>Communications:</strong> The content of messages you send to us, such as emails, chat messages, or other communications with our customer service team.</Typography></li></ul>
      <Typography component="h4" variant="h6">Cookies and Similar Technologies</Typography>
      <Typography>We use cookies and similar tracking technologies to collect information about your interactions with our Service. Cookies are small data files stored on your device that help us improve our Service and your experience, see which areas and features of our Service are popular, and count visits.</Typography>

      <Typography>You can set your browser to refuse all or some browser cookies or to alert you when cookies are being sent. However, if you disable or refuse cookies, some parts of our Service may be inaccessible or not function properly.</Typography></div>

    <div>
      <Typography component="h3" variant="h5">2. How We Use Your Information</Typography>
      <Typography>We use the information we collect for various purposes, including:</Typography>
      <ul><li><Typography><strong>To Provide Our Service:</strong> To operate, maintain, and deliver the features and functionality of our Service.</Typography></li><li><Typography><strong>To Provide Customer Support:</strong> To respond to your inquiries, comments, feedback, or questions.</Typography></li><li><Typography><strong>For Analytics and Improvement:</strong> To understand how users access and use our Service, and to improve our Service and develop new products, services, features, and functionality.</Typography></li><li><Typography><strong>For Legal Compliance:</strong> To comply with applicable legal obligations, including responding to subpoenas, court orders, or other legal process.</Typography></li>
        <li><Typography><strong>To Protect Rights and Safety:</strong> To protect our rights, property, or safety, or that of our users or others.</Typography></li>
      </ul>
    </div>

    <div>
      <Typography component="h3" variant="h5">3. How We Share Your Information</Typography>
      <Typography>We may share your personal information in the following circumstances:</Typography>
      <ul><li><Typography><strong>Service Providers:</strong> With third-party vendors, consultants, and other service providers who need access to your information to perform services on our behalf, such as hosting, data analysis, payment processing, and customer service.</Typography></li><li><Typography><strong>For Legal Reasons:</strong> When we believe in good faith that disclosure is necessary to comply with laws, regulations, or legal process (such as a subpoena or court order), or to protect our rights, property, or safety or that of our users or others.</Typography></li><li><Typography><strong>Business Transfers:</strong> In connection with, or during negotiations for, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.</Typography></li><li><Typography><strong>With Your Consent:</strong> With your consent or at your direction.</Typography></li>
      </ul>
    </div>

    <div>
      <Typography component="h3" variant="h5">4. Your Privacy Rights</Typography>
      <Typography component="h4" variant="h6">European Privacy Rights (GDPR)</Typography>
      <Typography>If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have certain rights regarding your personal information under the General Data Protection Regulation (GDPR) and similar laws, including:</Typography>
      <ul>
        <li><Typography><strong>Right of Access:</strong> The right to access personal information we hold about you.</Typography></li>
        <li><Typography><strong>Right to Rectification:</strong> The right to request that we correct inaccurate or incomplete personal information.</Typography></li>
        <li><Typography><strong>Right to Erasure:</strong> The right to request deletion of your personal information in certain circumstances.</Typography></li>
        <li><Typography><strong>Right to Restrict Processing:</strong> The right to request that we restrict processing of your personal information in certain circumstances.</Typography></li>
        <li><Typography><strong>Right to Data Portability:</strong> The right to receive personal information in a structured, commonly used, and machine-readable format.</Typography></li>
        <li><Typography><strong>Right to Object:</strong> The right to object to our processing of your personal information in certain circumstances.</Typography></li>
      </ul>
      <Typography>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</Typography>
      <Typography component="h4" variant="h6">California Privacy Rights (CCPA/CPRA)</Typography>
      <Typography>If you are a California resident, the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) provide you with specific rights regarding your personal information, including:</Typography>
      <ul>
        <li><Typography><strong>Right to Know:</strong> The right to know what personal information we collect, use, disclose, and sell about you.</Typography></li>
        <li><Typography><strong>Right to Delete:</strong> The right to request deletion of personal information we have collected about you.</Typography></li>
        <li><Typography><strong>Right to Opt-Out:</strong> The right to opt-out of the sale or sharing of your personal information.</Typography></li>
        <li><Typography><strong>Right to Non-Discrimination:</strong> The right not to receive discriminatory treatment for exercising your privacy rights.</Typography></li>
        <li><Typography><strong>Right to Limit Use of Sensitive Personal Information:</strong> The right to limit the use and disclosure of sensitive personal information.</Typography></li>
      </ul>
      <Typography>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</Typography></div>

    <div>
      <Typography component="h3" variant="h5">5. Data Security</Typography>
      <Typography>We implement reasonable security measures designed to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</Typography>

      <Typography>We restrict access to your personal information to those employees, contractors, and service providers who need to know that information to provide services to you. We regularly review our security procedures to consider appropriate new technology and methods.</Typography>
    </div>

    <div>
      <Typography component="h3" variant="h5">6. International Data Transfers</Typography>
      <Typography>We may transfer, store, and process your personal information in countries other than your own. Your personal information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.</Typography>

      <Typography>If you are located outside the United States and choose to provide information to us, please note that we may transfer the data to the United States and process it there. Your submission of such information represents your agreement to that transfer.</Typography>
      <Typography>When we transfer personal information from the European Economic Area, United Kingdom, or Switzerland to countries that have not been deemed to provide an adequate level of protection, we use specific mechanisms (such as standard contractual clauses) approved by the European Commission or other relevant authorities to ensure appropriate safeguards for your data.</Typography></div>

    <div>
      <Typography component="h3" variant="h5">7. Children's Privacy</Typography>
      <Typography>Our Service is not directed to children under the age of 13 in the United States, or the equivalent age in your jurisdiction. We do not knowingly collect personal information from children under these ages. If you are a parent or guardian and believe we have collected information from your child, please have your child cease using our Service and contact us so we can delete the information.</Typography>
    </div>

    <div>
      <Typography component="h3" variant="h5">8. Changes to This Privacy Policy</Typography>
      <Typography>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. If we make material changes to how we treat your personal information, we will notify you through a notice on our Service.</Typography>

      <Typography>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</Typography>
    </div>
    <div>
      <Typography component="h3" variant="h5">9. Contact Us</Typography>
      <Typography>If you have any questions about this Privacy Policy or our privacy practices, please contact us at <Link href={"mailto:" + props.email} sx={{color: "secondary"}}>{props.email}</Link></Typography>
    </div>
  </>;
}

export function TOS(props: {productName: string, email: string}) {
  return <>
    <div>
      <Typography><strong>Last Updated:</strong> August 15, 2025</Typography>
    </div>

    <div>
      <Typography component="h3" variant="h5">1. Introduction</Typography>
      <Typography>Welcome to {props.productName} (the "Website"). These Terms of Service govern your access to and use of the Website. Please read these terms carefully before using the Website.</Typography>

      <Typography>By accessing or using the Website, you agree to be bound by these Terms of Service. If you do not agree to these Terms of Service, please do not access or use the Website.</Typography>
    </div>

    <div>
      <Typography component="h3" variant="h5">2. Website Access and Use</Typography>
      <Typography>Subject to these Terms of Service, we grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the Website for your personal, non-commercial use.</Typography>
    </div>

    <div>
      <Typography component="h3" variant="h5">3. Prohibited Activities</Typography>
      <Typography>You agree not to:</Typography>
      <ul>
        <li><Typography>Use the Website in any way that violates any applicable law or regulation</Typography></li>
        <li><Typography>Attempt to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Website</Typography></li>
        <li><Typography>Use any robot, spider, crawler, scraper, or other automated means to access the Website</Typography></li>
        <li><Typography>Bypass measures we may use to prevent or restrict access to the Website</Typography></li>
        <li><Typography>Attempt to impersonate another user or person</Typography></li>
        <li><Typography>Post, upload, or distribute any content that is illegal or unlawful</Typography></li>
        <li><Typography>Post, upload, or distribute any content that is harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, or otherwise objectionable</Typography></li>
        <li><Typography>Post, upload, or distribute any content that infringes any patent, trademark, trade secret, copyright, or other intellectual property or proprietary rights</Typography></li>
        <li><Typography>Post, upload, or distribute any unsolicited or unauthorized advertising, promotional materials, "junk mail," "spam," "chain letters," or any other form of solicitation</Typography></li>
        <li><Typography>Post, upload, or distribute any content that contains viruses, malware, or other harmful components</Typography></li>
        <li><Typography>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity</Typography></li>
      </ul>
    </div>

    <div>
      <Typography component="h3" variant="h5">4. User Content</Typography>
      <Typography>The Website may allow you to post, upload, or submit content ("User Content"). We reserve the right to monitor User Content on the Website.</Typography><Typography>We reserve the right to remove or disable any User Content that we determine, in our sole discretion, violates these Terms of Service or is otherwise objectionable.</Typography><Typography>We do not undertake to review User Content before it is posted, and we cannot ensure prompt removal of objectionable material after it has been posted.</Typography><Typography>You retain all ownership rights in your User Content.</Typography></div>
    <div>
      <Typography component="h3" variant="h5">5. Intellectual Property</Typography>
      <Typography>The Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by {props.productName} or its licensors and are protected by copyright, trademark, and other intellectual property laws.</Typography><Typography>Trademarks, service marks, logos, and trade names appearing on the Website are the property of {props.productName} or their respective owners. The use of any trademark or name without permission is strictly prohibited.</Typography></div>
    <div>
      <Typography component="h3" variant="h5">6. Disclaimers and Limitation of Liability</Typography>
      <Typography><strong>Disclaimer of Warranties:</strong> THE WEBSITE AND ITS CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE WEBSITE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE WEBSITE OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</Typography><Typography><strong>Limitation of Liability:</strong> TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL {props.productName.toUpperCase()}, ITS DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (i) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE WEBSITE; (ii) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE WEBSITE; (iii) ANY CONTENT OBTAINED FROM THE WEBSITE; AND (iv) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.</Typography><Typography><strong>Indemnification:</strong> You agree to indemnify, defend, and hold harmless {props.productName}, its affiliates, officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) that arise from or relate to: (a) your use of the Website; (b) your violation of these Terms of Service; or (c) your violation of any rights of another.</Typography></div>
    <div>
      <Typography component="h3" variant="h5">7. Governing Law and Dispute Resolution</Typography>
      <Typography><strong>Governing Law:</strong> These Terms of Service shall be governed by and construed in accordance with the laws of Massachusetts, without regard to its conflict of law principles.</Typography>
      <Typography><strong>Dispute Resolution:</strong> Any dispute arising out of or relating to these Terms of Service shall be subject to the exclusive jurisdiction of the courts located within Massachusetts.</Typography></div>
    <div>
      <Typography component="h3" variant="h5">8. Miscellaneous</Typography>
      <Typography><strong>Changes to Terms:</strong> We reserve the right to update or modify these Terms of Service at any time without prior notice. We will provide notice of changes by posting the updated Terms of Service on the Website. Your continued use of the Website after any changes indicates your acceptance of the revised Terms of Service.</Typography><Typography><strong>Severability:</strong> If any provision of these Terms of Service is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced to the fullest extent possible under law.</Typography><Typography><strong>Entire Agreement:</strong> These Terms of Service constitute the entire agreement between you and {props.productName} regarding the use of the Website, superseding any prior agreements between you and {props.productName}.</Typography></div>
    <div>
      <Typography component="h3" variant="h5">9. Contact Information</Typography>
      <Typography>If you have any questions about these Terms of Service, please contact us at <Link href={"mailto:" + props.email} sx={{color: "secondary"}}>{props.email}</Link></Typography></div>
  </>;
}