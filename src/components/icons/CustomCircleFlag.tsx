import { CircleFlag } from 'react-circle-flags'

interface CustomCircleFlagProps {
  countryCode: string
}

/**
 * Use older version for safari compatibility
 * https://github.com/HatScripts/circle-flags/issues/41
 *
 * @param props
 * @returns
 */
export const CustomCircleFlag = ({
  countryCode,
}: CustomCircleFlagProps): JSX.Element => {
  return (
    <CircleFlag
      countryCode={countryCode}
      cdnUrl="https://raw.githubusercontent.com/HatScripts/circle-flags/148ed57f5aebda2e4440818be02b951b60f222b0/flags/"
    />
  )
}
