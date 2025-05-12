
// This is a utility file for PDF handling functions
// In a real app, we'd use a PDF parsing library

export const extractTextFromPdf = async (file: File): Promise<string> => {
  // In a real app, this would use a PDF library to extract text
  // For this demo, we'll simulate text extraction
  
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = () => {
        // Simulate text extraction from PDF
        // In a real app, we would use a proper PDF parser library
        const fileName = file.name.toLowerCase();
        
        // Generate appropriate content based on filename patterns
        let simulatedText = "";
        
        if (fileName.includes("leave") || fileName.includes("policy")) {
          simulatedText = `
            COMPANY STANDARD OPERATING PROCEDURE
            
            TITLE: Employee Leave Policy
            DOCUMENT NO: SOP-HR-001
            VERSION: 1.2
            EFFECTIVE DATE: January 1, 2023
            
            1. PURPOSE
            This Standard Operating Procedure (SOP) establishes guidelines for requesting, approving, and managing employee leave to ensure fair and consistent treatment of all employees while maintaining operational efficiency.
            
            2. SCOPE
            This SOP applies to all full-time and part-time employees across all departments and locations.
            
            3. RESPONSIBILITIES
            3.1 Employees are responsible for:
            - Submitting leave requests with reasonable advance notice
            - Providing required documentation for certain types of leave
            - Ensuring work handover before extended leave
            
            3.2 Managers are responsible for:
            - Reviewing and approving/denying leave requests promptly
            - Ensuring adequate coverage during employee absence
            - Maintaining accurate leave records
            
            3.3 HR Department is responsible for:
            - Administering the leave policy
            - Providing guidance on complex leave situations
            - Ensuring compliance with relevant employment laws
            
            4. TYPES OF LEAVE
            4.1 Annual Leave
            - Full-time employees accrue 20 days per calendar year
            - Part-time employees receive prorated leave based on hours worked
            - Maximum 5 days can be carried forward to the next calendar year
            
            4.2 Sick Leave
            - 10 days paid sick leave per year
            - Medical certificate required for absences exceeding 2 consecutive days
            - Unused sick leave does not carry over to the next year
            
            4.3 Parental Leave
            - Primary caregiver: 12 weeks paid leave
            - Secondary caregiver: 2 weeks paid leave
            - Must be taken within 12 months of birth/adoption
            
            4.4 Bereavement Leave
            - Up to 5 days for immediate family members
            - Up to 2 days for extended family members
            
            5. PROCEDURE
            5.1 Requesting Leave
            - Submit requests through the company HRIS at least 2 weeks in advance
            - Include start date, end date, and type of leave
            - For emergency leave, notify manager as soon as possible
            
            5.2 Approval Process
            - Managers must respond to requests within 3 business days
            - Leave approval is subject to business needs and staffing levels
            - Conflicts resolved based on seniority and date of request
            
            5.3 Cancellation or Changes
            - Employees must provide at least 3 days notice for cancellation
            - Changes to approved leave require manager approval
            
            6. SPECIAL CIRCUMSTANCES
            6.1 Extended Leave
            - Requests exceeding 15 consecutive working days require department head approval
            - Work handover plan must be submitted with request
            
            6.2 Holiday Periods
            - Leave requests during peak periods (Dec 15-Jan 15) must be submitted by Oct 1
            - Approval is based on rotation system to ensure fairness
            
            7. RECORD KEEPING
            - All leave records maintained in HRIS for 3 years
            - Monthly reports generated for management review
            - Employees can view their leave balance at any time in HRIS
            
            8. POLICY VIOLATIONS
            Failure to follow proper leave procedures may result in:
            - Leave being recorded as unpaid
            - Disciplinary action for repeat violations
            
            9. REFERENCE DOCUMENTS
            - Employee Handbook Section 4.2
            - Local employment laws and regulations
            
            10. REVISION HISTORY
            Version 1.0 - Initial release (January 2022)
            Version 1.1 - Updated sick leave requirements (June 2022)
            Version 1.2 - Added extended leave section (January 2023)
          `;
        } else if (fileName.includes("health") || fileName.includes("safety")) {
          simulatedText = `
            COMPANY STANDARD OPERATING PROCEDURE
            
            TITLE: Workplace Health and Safety Policy
            DOCUMENT NO: SOP-HS-002
            VERSION: 2.0
            EFFECTIVE DATE: March 15, 2023
            
            1. PURPOSE
            This Standard Operating Procedure (SOP) establishes guidelines for maintaining a safe and healthy workplace for all employees, contractors, and visitors.
            
            2. SCOPE
            This SOP applies to all company premises, work sites, and company-sponsored events.
            
            3. RESPONSIBILITIES
            3.1 Employees are responsible for:
            - Following all safety procedures and guidelines
            - Reporting hazards and incidents promptly
            - Using required protective equipment
            
            3.2 Managers are responsible for:
            - Ensuring safety compliance within their departments
            - Conducting regular safety inspections
            - Addressing reported hazards promptly
            
            3.3 Health & Safety Committee is responsible for:
            - Developing and reviewing safety policies
            - Investigating serious incidents
            - Recommending safety improvements
            
            4. HAZARD IDENTIFICATION
            4.1 Regular Inspections
            - Monthly workplace inspections by department managers
            - Quarterly comprehensive inspections by H&S Committee
            - Annual third-party safety audit
            
            4.2 Reporting Process
            - Hazards must be reported via safety reporting system
            - Critical hazards require immediate verbal notification
            - Safety suggestions can be submitted anonymously
            
            5. EMERGENCY PROCEDURES
            5.1 Fire Emergencies
            - Activate nearest fire alarm
            - Evacuate using designated exit routes
            - Assemble at designated meeting points
            - Department managers to account for all team members
            
            5.2 Medical Emergencies
            - Call emergency services (911)
            - Notify the designated first aid responder
            - Secure the area and prevent further injuries
            - Complete incident report within 24 hours
            
            6. TRAINING REQUIREMENTS
            6.1 New Employees
            - Complete safety orientation within first week
            - Department-specific safety training within first month
            - Documentation of completed training maintained by HR
            
            6.2 Ongoing Training
            - Annual refresher for all employees
            - Specialized training for high-risk operations
            - Safety drills conducted quarterly
            
            7. PERSONAL PROTECTIVE EQUIPMENT
            - PPE requirements specified by job role
            - Company provides all required PPE at no cost
            - Damaged PPE must be reported and replaced immediately
            - Failure to use required PPE may result in disciplinary action
            
            8. INCIDENT REPORTING AND INVESTIGATION
            8.1 Reporting
            - All incidents must be reported within 24 hours
            - Near misses must also be reported
            - Report forms available on company intranet
            
            8.2 Investigation
            - Serious incidents investigated by H&S Committee
            - Root cause analysis for all reportable incidents
            - Recommendations implemented to prevent recurrence
            
            9. COMPLIANCE MONITORING
            - Regular safety audits conducted
            - Compliance metrics reported monthly
            - Safety performance linked to management evaluation
            
            10. REVISION HISTORY
            Version 1.0 - Initial release (May 2021)
            Version 1.5 - Updated emergency procedures (November 2022)
            Version 2.0 - Comprehensive revision (March 2023)
          `;
        } else {
          // Default generic SOP text
          simulatedText = `
            COMPANY STANDARD OPERATING PROCEDURE
            
            TITLE: ${file.name.replace('.pdf', '').toUpperCase()}
            DOCUMENT NO: SOP-GEN-001
            VERSION: 1.0
            EFFECTIVE DATE: ${new Date().toLocaleDateString()}
            
            1. PURPOSE
            This Standard Operating Procedure (SOP) provides guidelines for standardized processes within the organization.
            
            2. SCOPE
            This SOP applies to all relevant departments and personnel involved in the described processes.
            
            3. DEFINITIONS
            SOP: Standard Operating Procedure
            Policy: Formal statement of principles
            Procedure: Step-by-step instructions for performing tasks
            
            4. RESPONSIBILITIES
            4.1 Department Heads are responsible for:
            - Ensuring compliance with this SOP
            - Providing necessary resources
            - Reviewing and approving changes
            
            4.2 Employees are responsible for:
            - Following documented procedures
            - Suggesting improvements when appropriate
            - Reporting non-compliance
            
            5. PROCEDURE
            5.1 Documentation Requirements
            - All processes must be documented
            - Standard templates must be used
            - Review schedule must be established
            
            5.2 Approval Process
            - Department review required
            - Quality assurance check
            - Final approval by department head
            
            5.3 Implementation
            - Training conducted for affected staff
            - Documentation distributed to relevant parties
            - Effective date clearly communicated
            
            6. QUALITY CONTROL
            - Regular audits conducted
            - Performance metrics established
            - Continuous improvement process
            
            7. REFERENCE DOCUMENTS
            - Company Quality Manual
            - ISO 9001:2015 requirements
            - Regulatory guidelines
            
            8. REVISION HISTORY
            Version 1.0 - Initial release (${new Date().toLocaleDateString()})
          `;
        }
        
        resolve(simulatedText);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
};
