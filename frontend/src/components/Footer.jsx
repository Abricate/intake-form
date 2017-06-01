import React from 'react';
import { Col, Row, Input } from 'reactstrap';

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
        <dd>Address</dd>
        <dt>344 20th St, Oakland, CA 94612</dt>
        <dd>Email Address</dd>
        <dt><a mailto="make@abricate.com">make@abricate.com</a></dt>
      </dl>
    </Col>
    <Col>
      <div>
        <form action="//abricate.us15.list-manage.com/subscribe/post?u=fa300b0e692bc24d7ddacc208&amp;id=30a4ae9bfe" method="post" target="print_popup">
          <p className="lead">Sign up for news and events!</p>
          <Row>
            <Col>
              <Input placeholder="First" name="FNAME" />
            </Col>
            <Col>
              <Input type="text" placeholder="Last" name="LNAME" />
            </Col>
          </Row>
          <Row>
            <Col>
              <Input type="email" placeholder="Email" name="EMAIL" />
            </Col>
          </Row>
          
          <Row>
            <Col>
              <button type="submit" name="subscribe">Submit</button>
            </Col>
          </Row>
          
        </form>
      </div>
    </Col>
  </Row>
);

export default Footer;
