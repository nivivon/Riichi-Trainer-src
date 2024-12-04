import React from 'react';
import { Container, Collapse, Card, CardBody, Button, Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';

class StatsDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.toggleStats = this.toggleStats.bind(this);
        this.toggleConfirm = this.toggleConfirm.bind(this);
        this.state = {
            statsCollapsed: true,
            confirmCollapsed: true
        };
    }

    toggleStats() {
        this.setState({ statsCollapsed: !this.state.statsCollapsed });
    }

    toggleConfirm() {
        this.setState({ confirmCollapsed: !this.state.confirmCollapsed });
    }

    render() {
        const { t, values, useTimer } = this.props;

        let correctGuesses = values.correctGuesses || 0;
        let totalGuesses = values.totalGuesses || 0;
        let correctRate = totalGuesses > 0 ? (correctGuesses / totalGuesses) * 100 : 0;
        correctRate = Math.round(correctRate);

        let averageTime = values.totalTime / totalGuesses;
        if (isNaN(averageTime)) averageTime = 0;
        averageTime = Math.round(averageTime * 10) / 10;

        return (
            <Container>
                <Button color="primary" onClick={this.toggleStats}>{t("shanten.stats.buttonLabel")}</Button>
                <Collapse isOpen={!this.state.statsCollapsed}>
                    <Card><CardBody>
                        <Row>
                            {t("shanten.stats.correctGuesses", { count: correctGuesses, total: totalGuesses, percent: correctRate })}
                        </Row>
                        {useTimer && <Row>
                            {t("shanten.stats.averageTime", { time: averageTime })}
                        </Row>}
                        <Row className="mt-4">
                            <Button color="danger" onClick={this.toggleConfirm}>{t("shanten.stats.reset")}</Button>
                        </Row>
                        <Row>
                            <Collapse isOpen={!this.state.confirmCollapsed}>
                                <Card><CardBody>
                                    <Row>{t("shanten.stats.confirmation")}</Row>
                                    <Row>
                                        <Button color="danger" onClick={this.props.onReset}>{t("shanten.stats.yes")}</Button>
                                        <Col xs="1" />
                                        <Button color="success" onClick={this.toggleConfirm}>{t("shanten.stats.no")}</Button>
                                    </Row>
                                </CardBody></Card>
                            </Collapse>
                        </Row>
                    </CardBody></Card>
                </Collapse>
            </Container>
        );
    }
}

export default withTranslation()(StatsDisplay);