import React from 'react';
import { Container, Collapse, Card, CardBody, Button, Row, Col, Input, Label } from 'reactstrap';
import NumericInput from 'react-numeric-input';
import { withTranslation } from "react-i18next";

const SETTINGS_KEY = "shantenSettings";
const DEFAULT_TIME = 10;

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            collapsed: true,
            settings: {
                useTimer: false,
                time: DEFAULT_TIME,
            }
        };

        this.onSettingChanged = this.onSettingChanged.bind(this);
    }

    toggle() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    componentDidMount() {
        try {
            let savedSettings = window.localStorage.getItem(SETTINGS_KEY);
            if (savedSettings) {
                savedSettings = JSON.parse(savedSettings);

                let settings = {
                    useTimer: savedSettings.useTimer,
                    time: savedSettings.time || DEFAULT_TIME,
                }

                this.setState({
                    settings: settings
                });

                this.props.onChange(settings);
            } else {
                this.props.onChange(this.state.settings);
            }
        } catch {
            this.props.onChange(this.state.settings);
        }
    }

    onSettingChanged(event, numberString, numberInput) {
        if (!event) return;

        let settings = this.state.settings;

        if (typeof event === "number") {
            settings[numberInput.id] = event;
        }
        else {
            settings[event.target.id] = !settings[event.target.id];
        }

        this.setState({
            settings: settings
        });

        try {
            window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch { }

        this.props.onChange(settings);
    }

    render() {
        const { t } = this.props;
        return (
            <Container>
                <Button color="primary" onClick={this.toggle}>{t("settings.buttonLabel")}</Button>
                <Collapse isOpen={!this.state.collapsed}>
                    <Card><CardBody>
                        <Row>
                            <Col className="form-check form-check-inline">
                                <Input className="form-check-input" type="checkbox" id="useTimer"
                                    checked={this.state.settings.useTimer} onChange={this.onSettingChanged} />
                                <Label className="form-check-label" for="useTimer">{t("settings.useTimer")}</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="form-check form-check-inline">
                                <Label className="form-check-label" for="time">{t("settings.time")}&nbsp;</Label>
                                <NumericInput className="form-check-input" type="number" id="time"
                                    min={1} max={99} step={1}
                                    value={this.state.settings.time} onChange={this.onSettingChanged} />
                                <span className="blackText">&nbsp;{t("settings.seconds")}</span>
                            </Col>
                        </Row>
                    </CardBody></Card>
                </Collapse>
            </Container>
        );
    }
}

export default withTranslation()(Settings);