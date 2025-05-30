import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Cohort, Form, Stage } from "../../utils/types"

interface CoachOverview {
  _id: string
  name: string
  forms: Form[]
  trainees: string[]
  participantsInfo: string[]
  coaches: string[]
  stages: Stage[]
}

export const useCohortSelection = (
  allCohorts: Cohort[] | undefined,
  coachOverview: CoachOverview | null,
) => {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  const { register, watch } = useForm<{ cohortId: string }>({
    defaultValues: { cohortId: "" },
  })
  const cohortOptions = useMemo(
    () =>
      allCohorts?.map((cohort: Cohort) => ({
        value: cohort._id,
        label: cohort.name,
      })) ?? [],
    [allCohorts],
  )

  const defaultCohortId = useMemo(() => {
    if (!allCohorts?.length) return null
    const activeCohort = allCohorts.find((cohort: Cohort) => cohort.isActive)
    return activeCohort?._id ?? null
  }, [allCohorts])

  useEffect(() => {
    if (!hasInitialized && allCohorts?.length) {
      const initialId = coachOverview?._id ?? defaultCohortId
      if (initialId) {
        setSelectedCohortId(initialId)
      }

      setHasInitialized(true)
    }
  }, [hasInitialized, allCohorts, coachOverview, defaultCohortId])

  useEffect(() => {
    const subscription = watch(({ cohortId }) => {
      if (cohortId && cohortId !== selectedCohortId) {
        setSelectedCohortId(cohortId)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, selectedCohortId])

  const selectedCohort = useMemo(() => {
    if (!selectedCohortId || !allCohorts?.length) return undefined

    const cohort = allCohorts.find((cohort) => cohort._id === selectedCohortId)
    return cohort ? { value: cohort._id, label: cohort.name } : undefined
  }, [selectedCohortId, allCohorts])

  return {
    selectedCohortId,
    selectedCohort,
    cohortOptions,
    register: register("cohortId"),
    isInitialized: hasInitialized,
  }
}
