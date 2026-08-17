import React from 'react';
import { DocumentHeader, DocumentFooter } from './DocumentHeaderFooter';
import { formatDateForDoc } from '../utils/validation';

export const UndertakingTemplate = ({ data = {} }) => {
  const {
    studentName = "Shubham Santosh Alapure",
    salutation = "Mr.",
    className = "B.Tech Final Year (Computer Science & Engineering)",
    rollNumber = "CS2022-084",
    enrollmentNumber = "MITADT2022CS084",
    department = "Department of Computer Science & Engineering",
    universityName = "MIT Art, Design and Technology University, Pune",
    schoolName = "School of Computing",
    companyName = "Google Cloud Platform / DeepMind Technologies",
    internshipRole = "Software Engineering Intern - Cloud AI",
    duration = "6 Months",
    startDate = "2026-01-05",
    endDate = "2026-06-30",
    location = "Bangalore / Hybrid",
    contactNumber = "9876543210",
    email = "shubham.alapure@mitadt.edu.in",
    documentDate = new Date().toISOString().split('T')[0],
    mentorName = "Dr. Rajesh K. Sharma"
  } = data;

  const pronoun = salutation === "Ms." || salutation === "Mrs." ? "she" : "he";
  const possessive = salutation === "Ms." || salutation === "Mrs." ? "her" : "his";

  return (
    <div className="a4-document-paper" id="undertaking-document">
      {/* University Institutional Header */}
      <DocumentHeader 
        universityName={universityName || "MIT Art, Design and Technology University, Pune"} 
        schoolName={schoolName || "School of Computing"}
        department={department || "Department of Computer Science & Engineering"}
      />

      {/* Date Row */}
      <div className="doc-ref-date-row" style={{ justifyContent: 'flex-end' }}>
        <div>
          <span>Date: </span>
          <span className="doc-dynamic-text">{formatDateForDoc(documentDate)}</span>
        </div>
      </div>

      {/* Title */}
      <div className="doc-title-center-wrap">
        <div className="doc-main-title">
          INTERNSHIP UNDERTAKING
        </div>
      </div>

      {/* Formal Salutation & Preamble */}
      <div style={{ marginBottom: '10px', fontSize: '10pt', fontFamily: 'var(--font-doc-serif)' }}>
        <div>To,</div>
        <div style={{ fontWeight: '700' }}>The Head of Department / Academic Mentor,</div>
        <div>{schoolName}, {universityName}</div>
      </div>

      {/* Student & Internship Context Paragraph */}
      <p className="doc-body-paragraph">
        I, <span className="doc-dynamic-text">{salutation} {studentName}</span>, a bona fide student of class <span className="doc-dynamic-text">{className}</span>, 
        bearing Roll No. <span className="doc-dynamic-text">{rollNumber}</span> and University Enrollment No. <span className="doc-dynamic-text">{enrollmentNumber}</span> of the 
        <span className="doc-dynamic-text"> {department}</span> at <span className="doc-dynamic-text">{universityName}</span>, have received an internship offer 
        from <span className="doc-dynamic-text">{companyName}</span> for the position of <span className="doc-dynamic-text">{internshipRole}</span> for a tenure of 
        <span className="doc-dynamic-text"> {duration}</span> from <span className="doc-dynamic-text">{formatDateForDoc(startDate)}</span> to <span className="doc-dynamic-text">{formatDateForDoc(endDate)}</span> located 
        at <span className="doc-dynamic-text">{location}</span>.
      </p>

      <p className="doc-body-paragraph" style={{ marginBottom: '8px' }}>
        I hereby solemnly declare, accept, and submit this undertaking with full consciousness of the following terms and regulations:
      </p>

      {/* Undertaking Points I to IX */}
      <ul className="doc-points-list">
        <li className="doc-point-item">
          <span className="doc-point-num">I.</span>
          <span>
            I will strictly abide by all institutional rules, university code of conduct, and corporate policies of <strong>{companyName}</strong> throughout my internship tenure.
          </span>
        </li>
        <li className="doc-point-item">
          <span className="doc-point-num">II.</span>
          <span>
            I will maintain regular communication with my allocated academic mentor (<strong>{mentorName}</strong>) and submit fortnightly progress reports, attendance logs, and project milestones on time.
          </span>
        </li>
        <li className="doc-point-item">
          <span className="doc-point-num">III.</span>
          <span>
            I understand that completion of all academic deliverables, semester examinations, presentations, and viva-voce is solely my responsibility and I will appear for the same as per university schedules.
          </span>
        </li>
        <li className="doc-point-item">
          <span className="doc-point-num">IV.</span>
          <span>
            I shall not engage in any unauthorized absence, disciplinary misconduct, or activities that tarnish the reputation of the University or the host organization.
          </span>
        </li>
        <li className="doc-point-item">
          <span className="doc-point-num">V.</span>
          <span>
            I will honor Non-Disclosure Agreements (NDA) and intellectual property rights of the company while adhering to fair evaluation practices required by the department.
          </span>
        </li>
        <li className="doc-point-item">
          <span className="doc-point-num">VI.</span>
          <span>
            In the event of any discontinuation, change in work domain, or premature termination of the internship, I shall notify the Head of Department within 48 hours.
          </span>
        </li>
        <li className="doc-point-item">
          <span className="doc-point-num">VII.</span>
          <span>
            I acknowledge that any malpractice, falsification of documents, or unauthorized absconding will attract severe academic disciplinary action and cancellation of internship credits.
          </span>
        </li>
        <li className="doc-point-item">
          <span className="doc-point-num">VIII.</span>
          <span>
            The University will not be held liable for any personal injury, financial dispute, travel risk, or intellectual property disputes arising during the industrial engagement.
          </span>
        </li>
        <li className="doc-point-item">
          <span className="doc-point-num">IX.</span>
          <span>
            I confirm that I have verified all details provided herein and will submit the final Internship Completion Certificate & Evaluation Sheet issued by <strong>{companyName}</strong> upon completion.
          </span>
        </li>
      </ul>

      {/* Signature & Candidate Details Section */}
      <div style={{
        marginTop: '18px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1fr',
        gap: '16px',
        fontFamily: 'var(--font-doc-sans)',
        fontSize: '8.5pt'
      }}>
        {/* Student Signature Box */}
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '8px 10px',
          backgroundColor: '#fafbfc'
        }}>
          <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Candidate Details & Sign:</div>
          <div style={{ height: '32px' }}></div>
          <div style={{ borderTop: '1px dashed #475569', paddingTop: '4px' }}>
            <div><strong>Signature:</strong> _______________________</div>
            <div><strong>Name:</strong> <span className="doc-dynamic-text">{studentName}</span></div>
            <div><strong>Roll No:</strong> {rollNumber}</div>
            <div><strong>Contact:</strong> {contactNumber}</div>
            <div><strong>Email:</strong> {email}</div>
          </div>
        </div>

        {/* Mentor Signature Box */}
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '8px 10px',
          backgroundColor: '#fafbfc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Academic Mentor:</div>
            <div><strong>Name:</strong> {mentorName}</div>
            <div style={{ color: '#64748b', fontSize: '8pt' }}>School of Computing</div>
          </div>
          <div style={{ borderTop: '1px dashed #475569', paddingTop: '4px', textAlign: 'center' }}>
            <div style={{ height: '24px' }}></div>
            <div><strong>Signature & Date</strong></div>
          </div>
        </div>

        {/* HOD Endorsement Box */}
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '8px 10px',
          backgroundColor: '#fafbfc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Department Approval:</div>
            <div style={{ color: '#64748b', fontSize: '8pt' }}>Head of Department</div>
            <div style={{ color: '#64748b', fontSize: '8pt' }}>Training & Placement Cell</div>
          </div>
          <div style={{ borderTop: '1px dashed #475569', paddingTop: '4px', textAlign: 'center' }}>
            <div style={{ height: '24px' }}></div>
            <div><strong>Seal & Signature (HOD)</strong></div>
          </div>
        </div>
      </div>

      {/* University Institutional Footer */}
      <DocumentFooter 
        docCode="MIT-ADT/SOC/UT-2026/01"
      />
    </div>
  );
};
