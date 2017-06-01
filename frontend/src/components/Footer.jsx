import React from 'react';
import { Button, Col, Row, Input } from 'reactstrap';

import AbricateLogo from '../img/abricate-full-logo-wht.png';

import IconMail from '../img/icon-mail.png';
import IconOffice from '../img/icon-office.png';
import NsfLogo from '../img/nsf-logo.png';

const Footer = () => (
  <Row>
    <Col>
      <div className="mb-3">
        <img src={AbricateLogo} />
      </div>
      <div className="d-flex">
        <img width="41" height="41" src={NsfLogo} />
        <p className="nsf-text">
          National Science Foundation<br/>
          2016 Grant Recipient
        </p>
      </div>
    </Col>
    <Col>
      <h2>Get In Touch</h2>
      <dl>
        <dd><img src={IconOffice} width="37" height="37" /> Address</dd>
        <dt>344 20th St, Oakland, CA 94612</dt>
        <dd><img src={IconMail} width="37" height="37" /> Email Address</dd>
        <dt><a mailto="make@abricate.com">make@abricate.com</a></dt>
      </dl>
      <p className="copyright">Copyright &copy; 2017 Abricate, Inc. All rights reserved.</p>
    </Col>
    <Col>
      <div>
        <form action="//abricate.us15.list-manage.com/subscribe/post?u=fa300b0e692bc24d7ddacc208&amp;id=30a4ae9bfe" method="post" target="print_popup">
          <h2>Email Newsletter</h2>
          <p className="lead">Sign up for news and events!</p>
          <table cellPadding={2} width="100%">
            <tr>
              <td>
                <input placeholder="First" name="FNAME" />
              </td>
              <td>
                <input type="text" placeholder="Last" name="LNAME" />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <input type="email" placeholder="Email" name="EMAIL" />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <Button type="submit" color="primary" name="subscribe">Submit</Button>
              </td>
            </tr>
          </table>
        </form>
      </div>
    </Col>
  </Row>
);

export default Footer;
