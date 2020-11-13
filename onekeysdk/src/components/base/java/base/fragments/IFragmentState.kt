package base.fragments

import androidx.annotation.AnimRes
import androidx.annotation.AnimatorRes
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import java.util.*

interface IFragmentState {

    val isRootFragment: Boolean

    val stacks: ArrayList<Stack<IFragment>>

    fun currentStack(): Int

    fun getFragmentManager(): FragmentManager
    
    fun getRootFragments(): ArrayList<IFragment>?

    fun setStacksRootFragment(fragments: ArrayList<IFragment>)

    fun changeRootFragment(fragments: IFragment, stackId: Int)

    fun pushFragment(iPrevChangeFragAction: IPrevChangeFragAction?, fragment: IFragment)

    fun pushFragment(
        iPrevChangeFragAction: IPrevChangeFragAction,
        fragment: IFragment,
        ignoreDuplicate: Boolean
    )

    fun pushFragmentKeepOld(iPrevChangeFragAction: IPrevChangeFragAction?, fragment: IFragment)

    fun pushFragmentKeepOld(
        iPrevChangeFragAction: IPrevChangeFragAction?,
        fragment: IFragment,
        ignoreDuplicate: Boolean
    )

    fun popFragment(numberPop: Int)

    fun popFragment(index: Int, numberPop: Int)

    fun showStack(stackId: Int)

    fun isFragmentsAdded(): Boolean

    fun refreshStack(stackId: Int)

    fun replaceFragment(iPrevChangeFragAction: IPrevChangeFragAction, fragment: IFragment)

    fun clearStack(stackId: Int)
    fun clearAllOfStack(stackId: Int)

    fun clearAllStacks()

    fun getFragByTag(tag: String): Fragment

    fun beginTrans(): FragmentTransaction

    fun setCustomAnimation(@AnimatorRes @AnimRes inAnim: Int, @AnimatorRes @AnimRes outAnim: Int)

    fun enableAnim(enable: Boolean)

    fun resetAnimation()

    fun clearHandler()
}
