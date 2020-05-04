import styled from 'styled-components';
import { palette } from 'styled-theme';

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 8px;
  box-shadow: ${palette('shadow', 0)};
  &:hover {
    box-shadow: ${palette('shadow', 1)};
  }

  .card-header {
    display: flex;
    flex-direction: column;
    padding-bottom: 18px;
    border-bottom: 1px solid ${palette('border', 0)};

    .card-stats-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      font-size: 14px;

      .card-name {
        color: ${palette('primary', 0)};
      }

      .card-info-right {
        display: flex;
        align-items: center;
        text-transform: uppercase;
        .card-type {
          color: ${palette('primary', 0)};
        }

        .card-datetime,
        .card-type {
          padding-left: 10px;
        }
      }
    }

    .card-header-info {
      display: flex;
      flex-direction: column;

      .card-title {
        padding: 8px 0px;
        font-size: 24px;
        font-weight: bold;
      }
      .card-description {
        padding: 8px 0px;
        font-size: 12px;
      }
    }
  }

  .card-body {
    display: flex;
    flex-direction: column;
    padding-top: 18px;

    .card-content-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;

      .card-content-badge {
        display: flex;
        align-items: center;

        .badge-wrapper {
          margin-right: 8px;
        }
      }

      .card-content-stats {
        display: flex;
        align-items: center;
        font-size: 12px;

        & > div {
          margin-left: 14px;
        }

        .card-content-page {
          color: ${palette('primary', 0)};
        }
      }
    }

    .card-has-more {
      padding-top: 10px;
      color: ${palette('primary', 0)};
      font-size: 14px;
      line-height: 18px;
      cursor: pointer;
    }
  }
`;
