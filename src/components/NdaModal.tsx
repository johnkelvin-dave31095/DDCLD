import { useEffect, useState } from "react";
import type { UIEvent } from "react";

import styles from "./NdaModal.module.scss";

type NdaModalProps = {
  open: boolean;
  onAccept: () => void;
  onClose: () => void;
};

export default function NdaModal({ open, onAccept, onClose }: NdaModalProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  function handleNdaScroll(event: UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const isAtBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 12;

    if (isAtBottom) {
      setScrolledToBottom(true);
    }
  }

  function acceptNda() {
    onAccept();
    setScrolledToBottom(false);
  }

  function closeNda() {
    onClose();
    setScrolledToBottom(false);
  }

  return (
    <div className={styles.modalOverlay} role="presentation">
      <div
        className={styles.modalBox}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nda-title"
      >
        <h2 id="nda-title" className={styles.modalTitle}>
          Non-Disclosure Agreement (NDA)
        </h2>

        <div className={styles.modalScrollable} onScroll={handleNdaScroll}>
          <div className={styles.ndaContent}>
            <p>
              This Mutual Nondisclosure Agreement (this "Agreement") is made
              and entered into as of the date set forth below (the "Effective
              Date") by and between Terra Rossa, LP and related companies, with
              offices located at 3571 Far West Blvd, Suite 3519 Austin TX 78731
              ("Terra Rossa"), and the entity whose name and address are set
              forth below ("Company") (Terra Rossa) and Company sometimes are
              collectively referred to herein as the "Parties" and individually
              as a "Party"). Terra Rossa and Company may be discussing or
              evaluating a possible business transaction ("Business
              Transaction"). In connection with these discussions and the
              Business Transaction, each Party may disclose certain Confidential
              Information (as hereinafter defined) that it desires to be used
              only for the limited purpose for which it disclosed. As a result,
              Terra Rossa and Company hereby agree as follows:
            </p>

            <h3>1. Confidential Information.</h3>
            <p>
              The Party disclosing confidential information hereunder is
              hereinafter referred to as the "Disclosing Party" and the Party
              receiving confidential information hereunder is hereafter referred
              to as the "Receiving Party." For purposes of this Agreement,
              "Disclosing Party" includes affiliates of a Party who disclose
              Confidential Information to the Receiving Party regarding the
              Business Transactions. As used in this Agreement, "Confidential
              Information" means information not known to the public, whether of
              a technical, business or other nature that relates to the Business
              Transaction or that, although not related to such Business
              Transaction, is nevertheless disclosed as a result of the Parties'
              discussions in that regard, and that should reasonably have been
              understood by the Receiving Party, because of legends, markings,
              or relevant disclosures, to be proprietary and confidential to the
              Disclosing Party. Confidential Information includes the substance
              of the Parties' discussions and all third-party information that
              the Disclosing Party is obligated to keep confidential. Further,
              Confidential Information specifically includes, but is not limited
              to, any algorithms, databases, operating guides, software,
              know-how, lists of suppliers, procedures, strategies, proceedings
              of commercialization, financial formulas, technical,
              administrative, marketing and commercial knowledge, management and
              financial practices, statistical information, trade secrets (as
              defined by applicable state law), and technical specifications.
              Confidential Information may be disclosed in written or other
              tangible form (including information in computer software or held
              in electronic storage media) or by oral, visual or other means.
            </p>

            <h3>2. Use of Confidential Information.</h3>
            <p>
              The Receiving Party, except as expressly provided in this
              Agreement, shall not disclose the Disclosing Party's Confidential
              Information or the existence or purpose of this Agreement, the
              terms or conditions hereof, or the fact that discussions are
              taking place and that Confidential Information is being shared, to
              anyone without the Disclosing Party's prior written consent.
              Further, the Receiving Party shall not use, or permit others to
              use, Confidential Information for any purpose other than pursuit
              and evaluation of the Business Transaction. The Receiving Party
              shall not copy such Confidential Information of the other unless
              specifically authorized by the Disclosing Party. Each Party agrees
              that in the event permission is granted by the other to copy
              Confidential Information, or that copying is otherwise permitted
              hereunder, each such copy shall contain and state the same
              confidential or proprietary notices or legends, if any, which
              appear on the original. The Receiving Party shall protect such
              Confidential Information from disclosure to others, using the same
              degree of care used to protect its own confidential or proprietary
              information of like importance, but in any case, using no less
              than a reasonable degree of care. The Receiving Party shall not
              reverse-engineer, decompile, or disassemble any hardware or
              software provided or disclosed to it and shall not remove,
              overprint or deface any notice of copyright, trademark, logo,
              legend or other notice of ownership from any originals or copies
              of Confidential Information it obtains from the Disclosing Party.
            </p>

            <h3>3. Exceptions.</h3>
            <p>
              The provisions of Section 2 shall not apply to any information
              that (i) is or becomes publicly available without breach of this
              Agreement; (ii) can be shown by documentation to have been known
              to the Receiving Party without confidentiality restrictions at the
              time of its receipt from the Disclosing Party; (iii) is rightfully
              received from a third party who did not acquire or disclose such
              information by a wrongful or tortious act, or in breach of a
              confidentiality restriction; (iv) is independently developed by
              the Receiving Party; or (v) is identified by the Disclosing Party
              in writing as no longer proprietary or confidential. Any
              combination of Confidential Information disclosed with information
              not so classified shall not be deemed to be within one of the
              foregoing exclusions merely because individual portions of such
              combination are free of any confidentiality obligation or are
              separately known in the public domain.
            </p>

            <h3>4. Receiving Party Personnel.</h3>
            <p>
              The Receiving Party shall restrict the possession, knowledge,
              development and use of Confidential Information to its officers,
              directors, employees, agents, advisors, consultants, sources of
              financing, and contractors (collectively, "Personnel") who have a
              need-to-know Confidential Information for pursuit and evaluation
              of the Business Transaction. The Receiving Party's Personnel shall
              have access only to the Confidential Information they need for
              such purposes. All Personnel shall be subject to the terms of this
              Agreement and the Receiving Party agrees to take reasonable action
              by instruction, agreement or otherwise to ensure its Personnel
              comply with the restrictions of this Agreement. In addition to
              the foregoing, the Receiving Party shall cause any independent
              contractors at any level, agents and consultants that have access
              to any Confidential Information to enter into a written
              confidentiality agreement that shall be no less restrictive than
              the provisions of this Agreement.
            </p>

            <h3>5. Disclosures Required by Law.</h3>
            <p>
              The Receiving Party may disclose Confidential Information to the
              extent required by law or court order. However, where permitted
              by law, the Receiving Party shall give the Disclosing Party prompt
              notice of such disclosure to allow the Disclosing Party a
              reasonable opportunity to obtain a protective order and shall
              provide reasonable assistance to the Disclosing Party (at the
              Disclosing Party's expense) in seeking such a protective order. In
              the event disclosure is required as set forth above, Confidential
              Information may be disclosed only to the extent necessary to
              comply with such a requirement.
            </p>

            <h3>6. Ownership of Confidential Information.</h3>
            <p>
              All Confidential Information disclosed under this Agreement
              (including information in computer software or held in electronic
              storage media) shall remain the exclusive property of the
              Disclosing Party, and the Receiving Party shall have no rights, by
              license or otherwise, to use the Confidential Information except
              as expressly provided herein. No patent, copyright, trademark or
              other proprietary right is licensed, granted or otherwise conveyed
              by this Agreement with respect to Confidential Information or
              other information.
            </p>

            <h3>7. No Warranty or Obligation to Proceed.</h3>
            <p>
              Confidential Information is provided "AS IS" and no warranties of
              any kind are given by either Party with respect to the accuracy,
              appropriateness or completeness of information provided to the
              other. Each Party acknowledges that this Agreement and any
              meetings and communications of the parties relating to the same
              subject matter, including the exchange of Confidential
              Information, shall not: (a) constitute an offer, request, or
              contract with the other to engage in any research, development or
              other work; or (b) constitute an offer, request or contract
              involving a buyer-seller relationship, venture, teaming or
              partnership relationship between the parties. Each Party shall be
              responsible for all its own costs and expenses relating to, and
              each Party assumes all risk associated with any delays and lost
              opportunities resulting from, its communications, discussions and
              meetings with the other Party. Neither Party shall be liable to
              the other Party for damages of any kind whatsoever if negotiations
              do not ensue or reach an impasse or if a business arrangement is
              not consummated between the parties.
            </p>

            <h3>8. Return of Confidential Information.</h3>
            <p>
              The Receiving Party promptly shall return or destroy the portions
              of all tangible material embodying Confidential Information (in
              any form and including, without limitation, all summaries, copies
              and excerpts of Confidential Information and all electronic media
              or records containing or derived from Confidential Information)
              upon the Disclosing Party's written request. At the Disclosing
              Party's option, the Receiving Party shall provide written
              certification of its compliance with this Section 8.
            </p>

            <h3>9. Injunctive Relief</h3>
            <p>
              The Receiving Party acknowledges that Confidential Information is
              unique and valuable, and that disclosure or use of Confidential
              Information in violation of this Agreement could cause irreparable
              harm to the Disclosing Party for which monetary damages may be
              difficult to ascertain or be an inadequate remedy. Therefore, the
              Parties agree that in the event of a breach or threatened breach
              of confidentiality, the Disclosing Party shall be entitled to seek
              specific performance and injunctive or other equitable relief as a
              remedy for any such breach or anticipated breach without the
              necessity of posting a bond. Any such relief shall be in addition
              to and not in lieu of any appropriate relief in the way of
              monetary damages or otherwise.
            </p>

            <h3>10. Limited Relationship</h3>
            <p>
              This Agreement shall not create a joint venture, partnership, or
              other formal business relationship or entity of any kind, or an
              obligation to form any such relationship or entity. Each Party
              shall act as an independent contractor and not as an employee or
              agent of the other Party for any purpose and neither shall have
              the authority to bind the other.
            </p>

            <h3>11. Cumulative Obligations.</h3>
            <p>
              Each Party's obligations hereunder are in addition to, and not
              exclusive of, any and all of its other obligations and duties to
              the other Party, whether express or implied, in fact or in law.
            </p>

            <h3>12. Entire Agreement; Amendment.</h3>
            <p>
              This Agreement constitutes the entire agreement between the
              Parties relating to the matters discussed herein and may be
              amended or modified only with the mutual written consent of the
              Parties.
            </p>

            <h3>13. Scope; Termination.</h3>
            <p>
              This Agreement shall become effective as of the date first written
              below and shall automatically terminate at the end of one (1) year
              thereafter or upon the completion or termination of the Parties'
              evaluation or pursuit of the Business Transaction, whichever is
              earlier (the "Term"). Either Party may terminate the Agreement at
              any time during the Term on thirty (30) days prior written notice.
              Except to the extent superseded by a subsequent agreement, the
              rights and obligations of the parties with respect to
              Confidential Information shall survive the termination or
              expiration of this Agreement for a period of three (3) years from
              the effective date of such termination or expiration; provided
              that, Company's obligations with respect to any Confidential
              Information pertaining to Terra Rossa's software code and
              documentation, architecture, and other similar technical materials
              shall, subject to Section 3, survive any termination or expiration
              of this Agreement indefinitely.
            </p>

            <h3>14. Assignment.</h3>
            <p>
              Neither this Agreement nor any rights hereunder in whole or in
              part shall be assignable or otherwise transferable by either Party
              and the obligations contained in this Agreement shall survive and
              continue after termination of this Agreement, provided, that
              either Party may assign or transfer this Agreement and rights and
              obligations hereunder to any current or future affiliates or
              successor company if such assignee agrees in writing to the terms
              and conditions herein.
            </p>

            <h3>15. United States Export Laws and Regulations.</h3>
            <p>
              The Receiving Party shall adhere to the U.S. Export
              Administration Laws and Regulations and shall not export or
              re-export any Confidential Information, technical data, or
              products received from the Disclosing Party, or any direct product
              of such Confidential Information or technical data, to any person
              or company who is a legal resident of or is controlled by a legal
              resident of any proscribed country listed in Section 779.4(f) of
              the U.S. Export Administration Regulations (as the same may be
              amended from time to time), unless properly authorized by the U.S.
              Government. This requirement is not limited by the time period
              stated in this Agreement.
            </p>

            <h3>16. Arbitration.</h3>
            <p>
              Any claim, controversy or dispute between the Parties, their
              agents, employees, officers, directors or affiliated agents
              (Dispute) shall be resolved by arbitration conducted by a single
              arbitrator engaged in the practice of law, under the then current
              rules of the American Arbitration Association (AAA). The Federal
              Arbitration Act, 9 U.S.C. Secs. 1-16, not state law, shall govern
              the arbitrability of all Disputes. The arbitrator shall have
              authority to award compensatory damages only. The arbitrator's
              award shall be final and binding and may be entered in any court
              having jurisdiction thereof. Each Party shall pay its own costs
              and expenses of arbitration and one-half of the arbitrator's fees;
              however, either Party may request that the arbitrator include such
              costs, expenses and fees in the award. The laws of the State of
              California shall govern the construction and interpretation of
              this Agreement, and the arbitration shall occur in the State of
              California. It is expressly agreed that either Party may seek
              injunctive relief or specific performance of the obligations
              hereunder in an appropriate court of law or equity pending an
              award in arbitration.
            </p>

            <h3>17. Notices</h3>
            <p>
              Any notice to be given hereunder by either Party to the other,
              shall be in writing and shall be deemed given upon delivery, if
              sent by facsimile or by overnight courier, or 5 days after such
              notice is sent if sent by certified mail, return receipt
              requested.
            </p>
          </div>
        </div>

        {!scrolledToBottom && (
          <p className={styles.scrollHint}>
            Scroll to the bottom to enable Accept.
          </p>
        )}

        <div className={styles.modalActions}>
          <button
            type="button"
            disabled={!scrolledToBottom}
            className={`${styles.modalButton} ${
              !scrolledToBottom ? styles.modalButtonDisabled : ""
            }`}
            onClick={acceptNda}
          >
            Accept NDA
          </button>

          <button type="button" className={styles.modalClose} onClick={closeNda}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
