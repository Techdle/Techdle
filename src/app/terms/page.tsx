import { Header } from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header />
      <main className="max-w-2xl mx-auto py-8 px-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Account
        </Link>

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-8">Last updated: June 26, 2026</p>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">1. Acceptance of Terms</h2>
            <p className="mb-2">
              By accessing, browsing, or using Techdle (&quot;the Game,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you acknowledge that
              you have read, understood, and agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not
              agree to all of these Terms, you are prohibited from using or accessing the Game.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you (&quot;you&quot; or &quot;User&quot;) and the
              Techdle administrator. By creating an account or continuing to use the Game, you accept these Terms
              and our <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link> and
              <Link href="/cookies" className="text-blue-400 hover:underline"> Cookie Policy</Link>, which are
              incorporated herein by reference.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">2. Eligibility</h2>
            <p className="mb-2">
              The Game is intended for users who are at least 13 years of age. By using the Game, you represent and
              warrant that you are at least 13 years old. If you are under 13, you may not use the Game or provide any
              personal information to us.
            </p>
            <p>
              If you are between 13 and 18 years old, you represent that you have obtained parental or legal guardian
              consent to use the Game and agree to these Terms. Users under 18 may not use the Game if it violates
              applicable laws in their jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">3. Description of Service</h2>
            <p className="mb-2">
              Techdle is a daily word puzzle game. Players are presented with clues and attempt to identify the correct
              answer through a series of guesses. The Game is provided free of charge and is intended for personal,
              non-commercial entertainment purposes only.
            </p>
            <p>
              We reserve the right to modify, suspend, or discontinue any aspect of the Game at any time without prior
              notice. We shall not be liable to you or any third party for any modification, suspension, or
              discontinuation of the Game.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">4. User Accounts &amp; Registration</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Optional Nature</strong> — You may play the Game without registering an account. Account creation via Google sign-in is optional and used solely for cross-device progress synchronization.</li>
              <li><strong className="text-slate-300">Accuracy of Information</strong> — If you create an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the accuracy of this information.</li>
              <li><strong className="text-slate-300">Account Responsibility</strong> — You are solely responsible for all activity that occurs under your account. Techdle does not store passwords; authentication is handled entirely by Google. You agree to notify us immediately of any unauthorized use of your account.</li>
              <li><strong className="text-slate-300">Account Suspension &amp; Termination</strong> — We reserve the right, in our sole discretion, to suspend, disable, or permanently delete any account that violates these Terms, engages in abusive behavior, or for any reason or no reason, with or without notice.</li>
              <li><strong className="text-slate-300">Account Data Deletion</strong> — You may request deletion of your account and associated data at any time by contacting <span className="text-blue-400">johnlemargonzales@gmail.com</span>. We will process such requests within 30 days, subject to legal retention requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">5. Acceptable Use Policy</h2>
            <p className="mb-2">You agree to use the Game only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Use any automated means, including bots, scripts, scrapers, or crawlers, to access, monitor, or interact with the Game</li>
              <li>Attempt to reverse-engineer, decompile, disassemble, decrypt, or otherwise derive the source code or puzzle answers from the Game</li>
              <li>Interfere with, disrupt, or attempt to gain unauthorized access to the Game&apos;s servers, networks, security measures, or infrastructure</li>
              <li>Upload or transmit any viruses, malware, Trojan horses, or other harmful code</li>
              <li>Use the Game for any commercial purpose without our express written consent</li>
              <li>Harass, abuse, or harm other users or our staff</li>
              <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity</li>
              <li>Violate any applicable local, state, national, or international law or regulation</li>
              <li>Encourage or enable any other individual to do any of the foregoing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">6. Intellectual Property Rights</h2>
            <p className="mb-2">
              The Game, including but not limited to all puzzles, clues, text, graphics, logos, icons, images,
              audio clips, software, code, databases, and the overall &quot;look and feel,&quot; is owned by Techdle and is
              protected by copyright, trademark, trade dress, and other intellectual property laws.
            </p>
            <p className="mb-2">
              Unless otherwise noted, Techdle&apos;s name, logo, and all related names, product names, design marks,
              and slogans are trademarks of Techdle. You may not use any of our trademarks without our prior written
              permission.
            </p>
            <p className="font-semibold text-slate-200 mb-1">License Granted</p>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Game
              for personal, non-commercial entertainment purposes strictly in accordance with these Terms. This
              license does not grant you any right to copy, modify, distribute, sell, lease, sublicense, or create
              derivative works of the Game or any portion thereof.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">7. User Content &amp; Feedback</h2>
            <p className="mb-2">
              If you submit suggestions, ideas, comments, bug reports, or other feedback (&quot;Feedback&quot;) to Techdle,
              you grant us an irrevocable, perpetual, royalty-free, worldwide license to use, reproduce, modify,
              distribute, and incorporate that Feedback into the Game without any obligation of compensation or
                attribution.
            </p>
            <p>
              You retain ownership of any content you submit through the Game, but you grant us a non-exclusive,
              royalty-free, worldwide license to use, store, reproduce, and display such content solely for the
              purpose of operating and improving the Game.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">8. Third-Party Services</h2>
            <p className="mb-2">
              The Game integrates with third-party services, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Firebase (Google)</strong> — Provides authentication and cloud database services</li>
              <li><strong className="text-slate-300">DeepSeek</strong> — Used in dev mode for automated puzzle generation</li>
              <li><strong className="text-slate-300">Vercel</strong> — Hosting and edge network services</li>
            </ul>
            <p className="mt-2">
              We are not responsible for the practices of these third-party services. You agree to comply with their
              respective terms of service and privacy policies. We disclaim all liability arising from your use of
              third-party services accessed through the Game.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">9. Privacy &amp; Data Protection</h2>
            <p>
              Your use of the Game is governed by our <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>,
              which explains how we collect, use, store, and protect your personal data. By using the Game, you
              consent to the data practices described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">10. Disclaimer of Warranties</h2>
            <p className="mb-2">
              THE GAME IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER
              EXPRESS OR IMPLIED.
            </p>
            <p className="mb-2">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, TECHDLE EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER
              EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 mb-2">
              <li>Implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement</li>
              <li>Warranties that the Game will be uninterrupted, timely, secure, or error-free</li>
              <li>Warranties that defects will be corrected or that the Game is free of viruses or other harmful components</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of any content or information within the Game</li>
            </ul>
            <p>
              No advice or information, whether oral or written, obtained from Techdle or through the Game shall
              create any warranty not expressly stated in these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">11. Limitation of Liability</h2>
            <p className="mb-2">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL TECHDLE, ITS ADMINISTRATOR,
              OFFICERS, OR AFFILIATES BE LIABLE FOR ANY:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 mb-2">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Damages for loss of profits, goodwill, use, data, or other intangible losses</li>
              <li>Damages arising from your inability to access or use the Game</li>
              <li>Damages resulting from unauthorized access to or alteration of your data</li>
              <li>Damages for conduct or content of any third party on the Game</li>
            </ul>
            <p className="mb-2">
              This limitation applies whether the alleged liability is based on contract, tort (including negligence),
              strict liability, or any other legal theory, even if we have been advised of the possibility of such
              damage.
            </p>
            <p>
              OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THE GAME SHALL NOT EXCEED THE
              GREATER OF (A) THE AMOUNT YOU HAVE PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE
              TO THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100.00). AS THE GAME IS PROVIDED FREE OF CHARGE, THIS EFFECTIVELY
              MEANS OUR LIABILITY IS LIMITED TO $100.00.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">12. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Techdle, its administrator, and its affiliates from
              and against any and all claims, damages, obligations, losses, liabilities, costs, or demands, including
              reasonable attorneys&apos; fees, arising from or relating to: (a) your use of or access to the Game;
              (b) your violation of these Terms; (c) your violation of any third-party rights, including intellectual
              property or privacy rights; or (d) any content you submit to the Game. We reserve the right, at your
              expense, to assume the exclusive defense and control of any matter subject to indemnification.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">13. Copyright Infringement &amp; DMCA Notice</h2>
            <p className="mb-2">
              We respect the intellectual property rights of others and expect our users to do the same. If you believe
              that any material available on or through the Game infringes upon any copyright you own or control, please
              notify our Copyright Agent immediately with the following information:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 mb-2">
              <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
              <li>Identification of the copyrighted work claimed to have been infringed</li>
              <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to locate it</li>
              <li>Your contact information, including address, telephone number, and email address</li>
              <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner</li>
              <li>A statement that the information in the notification is accurate and, under penalty of perjury, that you are authorized to act on behalf of the owner</li>
            </ul>
            <p>
              DMCA notices should be sent to: <span className="text-blue-400">johnlemargonzales@gmail.com</span>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">14. Governing Law &amp; Jurisdiction</h2>
            <p className="mb-2">
              These Terms shall be governed by and construed in accordance with the laws of the Republic of the
              Philippines, without regard to its conflict of law provisions.
            </p>
            <p>
              Any disputes arising out of or relating to these Terms or the Game shall be resolved exclusively in the
              courts located in the Philippines. You consent to the personal jurisdiction of such courts and waive
              any objection to venue.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">15. Dispute Resolution &amp; Binding Arbitration</h2>
            <p className="mb-2">
              <strong className="text-slate-200">Informal Resolution First.</strong> Before filing any claim, you agree
              to attempt to resolve the dispute informally by contacting <span className="text-blue-400">johnlemargonzales@gmail.com</span>.
              We will attempt to resolve the dispute within thirty (30) days of receiving your notice. If the dispute
              cannot be resolved informally, it shall be resolved through binding arbitration.
            </p>
            <p className="mb-2">
              <strong className="text-slate-200">Arbitration.</strong> Any dispute, claim, or controversy arising out of
              or relating to these Terms or the Game shall be settled by binding arbitration administered in accordance
              with the rules of the Philippine Dispute Resolution Center, Inc. (PDRCI). The arbitration shall be
              conducted in English, in Manila, Philippines, by a single arbitrator.
            </p>
            <p className="mb-2">
              <strong className="text-slate-200">Class Action Waiver.</strong> YOU AND TECHDLE AGREE THAT ANY
              DISPUTE RESOLUTION PROCEEDINGS SHALL BE CONDUCTED ON AN INDIVIDUAL BASIS AND NOT AS A CLASS,
              CONSOLIDATED, OR REPRESENTATIVE ACTION. YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION
              OR CLASS-WIDE ARBITRATION AGAINST TECHDLE.
            </p>
            <p>
              This arbitration provision shall survive termination of these Terms. If any portion of this section is
              found to be unenforceable, the remainder shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">16. Severability</h2>
            <p>
              If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision shall
              be deemed severable from these Terms and shall not affect the validity and enforceability of the
              remaining provisions. The remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">17. Waiver</h2>
            <p>
              No waiver of any term or condition of these Terms shall be deemed a further or continuing waiver of
              such term or any other term. Our failure to assert any right or provision under these Terms shall not
              constitute a waiver of such right or provision.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">18. Entire Agreement</h2>
            <p>
              These Terms, together with our <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link> and
              <Link href="/cookies" className="text-blue-400 hover:underline"> Cookie Policy</Link>, constitute the
              entire agreement between you and Techdle regarding your use of the Game and supersede all prior or
              contemporaneous communications, agreements, and understandings, whether oral or written.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">19. Changes to These Terms</h2>
            <p className="mb-2">
              We reserve the right to modify or replace these Terms at any time and in our sole discretion. Material
              changes will be posted on this page with an updated &quot;Last updated&quot; date. We may also, but are not
              obligated to, notify you via email or through the Game interface.
            </p>
            <p>
              Your continued use of the Game after any changes to these Terms constitutes your acceptance of the new
              Terms. If you do not agree to the modified Terms, you must stop using the Game.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">20. Contact Information</h2>
            <p className="mb-2">
              For questions, concerns, or requests regarding these Terms of Service, you may contact us at:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Email:</strong> <span className="text-blue-400">johnlemargonzales@gmail.com</span></li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
